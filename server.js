"use strict";

var http = require("http");
var WebSocketServer = require("ws").WebSocketServer;

var port = process.env.PORT || 3000;
var maxText = 300;
var maxName = 32;
var rateWindow = 10000;
var rateLimit = 20;
var heartbeat = 30000;

// id -> { socket, name, sent: [timestamps] }
var clients = new Map();

function send(socket, payload) {
    if (socket.readyState === socket.OPEN) socket.send(JSON.stringify(payload));
}

function roster() {
    var users = [];
    clients.forEach(function(c, id) { users.push({ id: id, name: c.name }); });
    return users;
}

function announce(payload, skipId) {
    clients.forEach(function(c, id) {
        if (id !== skipId) send(c.socket, payload);
    });
}

function clean(text, max) {
    return String(text == null ? "" : text).replace(/\s+/g, " ").trim().slice(0, max);
}

// sliding window so one client can't flood the room
function rateOk(entry) {
    var now = Date.now();
    entry.sent = entry.sent.filter(function(t) { return now - t < rateWindow; });
    if (entry.sent.length >= rateLimit) return false;
    entry.sent.push(now);
    return true;
}

var server = http.createServer(function(req, res) {
    if (req.url === "/" || req.url === "/health") {
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ ok: true, online: clients.size }));
        return;
    }
    res.writeHead(404);
    res.end();
});

var wss = new WebSocketServer({ server: server });

wss.on("connection", function(socket) {
    socket.isAlive = true;
    socket.clientId = null;
    socket.on("pong", function() { socket.isAlive = true; });

    socket.on("message", function(raw) {
        var msg;
        try { msg = JSON.parse(raw); } catch (e) { return; }
        if (!msg || typeof msg.t !== "string") return;

        if (msg.t === "hello") {
            var id = clean(msg.id, 64);
            var name = clean(msg.name, maxName) || "anon";
            if (!id) return send(socket, { t: "error", reason: "missing id" });

            // same id reconnecting kicks the stale socket
            var prev = clients.get(id);
            if (prev && prev.socket !== socket) prev.socket.terminate();

            socket.clientId = id;
            clients.set(id, { socket: socket, name: name, sent: [] });
            send(socket, { t: "welcome", id: id, users: roster() });
            announce({ t: "presence", id: id, name: name, online: true }, id);
            return;
        }

        var entry = socket.clientId ? clients.get(socket.clientId) : null;
        if (!entry) return send(socket, { t: "error", reason: "say hello first" });

        if (msg.t === "who") {
            send(socket, { t: "who", users: roster() });
            return;
        }

        if (msg.t === "dm") {
            if (!rateOk(entry)) return send(socket, { t: "error", reason: "slow down" });
            var text = clean(msg.text, maxText);
            var to = clean(msg.to, 64);
            if (!text || !to) return;
            var target = clients.get(to);
            if (!target) return send(socket, { t: "error", reason: "offline", to: to });
            var at = Date.now();
            send(target.socket, { t: "dm", from: socket.clientId, name: entry.name, text: text, at: at });
            send(socket, { t: "sent", to: to, text: text, at: at });
            return;
        }
    });

    socket.on("close", function() {
        var id = socket.clientId;
        if (!id) return;
        // only drop it if this socket still owns the id
        var held = clients.get(id);
        if (held && held.socket === socket) {
            clients.delete(id);
            announce({ t: "presence", id: id, online: false });
        }
    });
});

// render's proxy drops idle sockets, so ping to keep them alive and reap dead ones
var beat = setInterval(function() {
    wss.clients.forEach(function(socket) {
        if (!socket.isAlive) { socket.terminate(); return; }
        socket.isAlive = false;
        socket.ping();
    });
}, heartbeat);

wss.on("close", function() { clearInterval(beat); });

server.listen(port, "0.0.0.0", function() {
    console.log("chat relay listening on " + port);
});
