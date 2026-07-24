"use strict";

var http = require("http");
var WebSocketServer = require("ws").WebSocketServer;

var port = process.env.PORT || 3000;
var maxText = 300;
var maxName = 32;
var heartbeat = 30000;
var syncStale = 250;

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

        if (msg.t === "time") {
            send(socket, { t: "time", c: msg.c });
            return;
        }

        if (msg.t === "registration") {
            var id = clean(msg.id, 64);
            var name = clean(msg.name, maxName) || "anon";
            if (!id) return send(socket, { t: "error", reason: "missing id" });

            var prev = clients.get(id);
            if (prev && prev.socket !== socket) prev.socket.terminate();

            socket.clientId = id;
            clients.set(id, { socket: socket, name: name });
            send(socket, { t: "welcome", id: id, users: roster() });
            announce({ t: "presence", id: id, name: name, online: true }, id);
            return;
        }

        var entry = socket.clientId ? clients.get(socket.clientId) : null;
        if (!entry) return send(socket, { t: "error", reason: "register first" });

        if (msg.t === "who") {
            send(socket, { t: "who", users: roster() });
            return;
        }

        if (msg.t === "say") {
            var sayText = clean(msg.text, maxText);
            if (!sayText) return;
            var out = { t: "say", from: socket.clientId, name: entry.name, text: sayText, at: Date.now() };
            clients.forEach(function(c) { send(c.socket, out); });
            return;
        }

        if (msg.t === "sync") {
            entry.sync = {
                server: clean(msg.server, 64),
                sid: msg.sid,
                target: msg.target,
                armed: !!msg.armed,
                at: Date.now()
            };
            if (!entry.sync.armed || entry.sync.target == null || entry.sync.sid == null) return;
            var mate = null;
            clients.forEach(function(c, cid) {
                if (mate || cid === socket.clientId) return;
                var o = c.sync;
                if (!o || !o.armed || o.target == null || o.sid == null) return;
                if (o.server !== entry.sync.server || o.target !== entry.sync.target) return;
                if (Date.now() - o.at > syncStale) return;
                mate = c;
            });
            if (!mate) return;
            send(socket, { t: "fire", partner: mate.sync.sid, target: entry.sync.target });
            send(mate.socket, { t: "fire", partner: entry.sync.sid, target: entry.sync.target });
            entry.sync.armed = false;
            mate.sync.armed = false;
            return;
        }
    });

    socket.on("close", function() {
        var id = socket.clientId;
        if (!id) return;
        var held = clients.get(id);
        if (held && held.socket === socket) {
            clients.delete(id);
            announce({ t: "presence", id: id, online: false });
        }
    });
});

var beat = setInterval(function() {
    wss.clients.forEach(function(socket) {
        if (!socket.isAlive) { socket.terminate(); return; }
        socket.isAlive = false;
        socket.ping();
    });
}, heartbeat);

wss.on("close", function() { clearInterval(beat); });

server.listen(port, "0.0.0.0");
