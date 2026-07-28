var msgpack = __webpack_require__( "./node_modules/msgpack-lite/lib/browser.js");
var config = __webpack_require__( "./src/js/config.js");

var pktMacLen = 6;
var pktModeObf = 1;
var pktTableSalt = 1;
var pktC2s = ["M", "D", "9", "e", "F", "z", "H", "K", "L", "N", "b", "P", "Q", "c", "6", "S", "0"];
var pktS2c = ["A", "B", "C", "D", "E", "a", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "X", "Y", "Z", "g", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
var pktState = null;

function pktRand(seed) {
    return function() {
        seed |= 0;
        seed = seed + 1831565813 | 0;
        var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}
function pktShuffle(names, seed) {
    var len = names.length;
    var idx = names.map(function(_, i) { return i; });
    var rnd = pktRand(seed >>> 0);
    for (var i = len - 1; i > 0; i--) {
        var j = Math.floor(rnd() * (i + 1));
        var tmp = idx[i]; idx[i] = idx[j]; idx[j] = tmp;
    }
    var enc = {}, dec = {};
    for (var k = 0; k < len; k++) { enc[names[k]] = idx[k]; dec[idx[k]] = names[k]; }
    return { enc: enc, dec: dec };
}
function pktTables(seed) {
    var t = (seed ^ Math.imul(pktTableSalt, 2654435761)) >>> 0;
    return { c2s: pktShuffle(pktC2s, t), s2c: pktShuffle(pktS2c, (t ^ 2246822507) >>> 0) };
}

var pktShaK = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]);
function pktRotr(x, n) { return x >>> n | x << 32 - n; }
function pktSha256(bytes) {
    var h = new Uint32Array([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]);
    var len = bytes.length, bitLen = len * 8;
    var buf = new Uint8Array(Math.ceil((len + 9) / 64) * 64);
    buf.set(bytes);
    buf[len] = 128;
    var view = new DataView(buf.buffer);
    view.setUint32(buf.length - 4, bitLen >>> 0, false);
    view.setUint32(buf.length - 8, Math.floor(bitLen / 4294967296), false);
    var w = new Uint32Array(64);
    for (var off = 0; off < buf.length; off += 64) {
        for (var i = 0; i < 16; i++) w[i] = view.getUint32(off + i * 4, false);
        for (var i = 16; i < 64; i++) {
            var s0 = pktRotr(w[i - 15], 7) ^ pktRotr(w[i - 15], 18) ^ w[i - 15] >>> 3;
            var s1 = pktRotr(w[i - 2], 17) ^ pktRotr(w[i - 2], 19) ^ w[i - 2] >>> 10;
            w[i] = w[i - 16] + s0 + w[i - 7] + s1 | 0;
        }
        var a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];
        for (var i = 0; i < 64; i++) {
            var S1 = pktRotr(e, 6) ^ pktRotr(e, 11) ^ pktRotr(e, 25);
            var ch = e & f ^ ~e & g;
            var t1 = hh + S1 + ch + pktShaK[i] + w[i] | 0;
            var S0 = pktRotr(a, 2) ^ pktRotr(a, 13) ^ pktRotr(a, 22);
            var maj = a & b ^ a & c ^ b & c;
            var t2 = S0 + maj | 0;
            hh = g; g = f; f = e; e = d + t1 | 0; d = c; c = b; b = a; a = t1 + t2 | 0;
        }
        h[0] = h[0] + a | 0; h[1] = h[1] + b | 0; h[2] = h[2] + c | 0; h[3] = h[3] + d | 0;
        h[4] = h[4] + e | 0; h[5] = h[5] + f | 0; h[6] = h[6] + g | 0; h[7] = h[7] + hh | 0;
    }
    var out = new Uint8Array(32), ov = new DataView(out.buffer);
    for (var i = 0; i < 8; i++) ov.setUint32(i * 4, h[i], false);
    return out;
}
function pktHmac(key, msg) {
    var k = key;
    if (k.length > 64) k = pktSha256(k);
    var padded = new Uint8Array(64);
    padded.set(k);
    var inner = new Uint8Array(64 + msg.length), outer = new Uint8Array(64 + 32);
    for (var i = 0; i < 64; i++) { inner[i] = padded[i] ^ 54; outer[i] = padded[i] ^ 92; }
    inner.set(msg, 64);
    outer.set(pktSha256(inner), 64);
    return pktSha256(outer);
}
function pktMac(key, payload) { return pktHmac(key, payload).subarray(0, pktMacLen); }
function pktKey(hex) {
    var out = new Uint8Array(hex.length / 2);
    for (var i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
    return out;
}

module.exports = {
    socket: null,
    connected: false,
    socketId: -1,
    connect: function(address, callback, events) {
        if (this.socket) return;

        var _this = this;
        try {
            var socketError = false;
            var socketAddress = address;
            var handshakeDone = false;
            this.socket = new WebSocket(socketAddress);
            this.socket.binaryType = "arraybuffer";
            this.socket.onmessage = function(message) {

                var bytes = new Uint8Array(message.data);
                var parsed = msgpack.decode(bytes);
                var type = parsed[0];
                var data = parsed[1];

                if (type == "io-init") {
                    _this.socketId = data[0];
                    pktState = (data[3] === pktModeObf) ? {
                        mode: pktModeObf,
                        key: pktKey(data[2]),
                        tables: pktTables(data[1] >>> 0),
                        seq: 0
                    } : null;
                    if (!handshakeDone) { handshakeDone = true; callback(); }
                    return;
                }
                if (pktState && typeof type == "number") {
                    type = pktState.tables.s2c.dec[type];
                    if (type === undefined) return;
                }
                var handler = events[type];
                if (handler) handler.apply(undefined, data);
            };
            this.socket.onopen = function() {
                _this.connected = true;
            };
            this.socket.onclose = function(event) {
                _this.connected = false;
                pktState = null;
                if (event.code == 4001) {
                    callback("Invalid Connection");
                } else if (!socketError) {
                    callback("disconnected");
                }
            };
            this.socket.onerror = function(error) {
                if (this.socket && this.socket.readyState != WebSocket.OPEN) {
                    socketError = true;
                    console.error("Socket error", arguments);
                    callback("Socket error");
                }
            };
        } catch(e) {
            console.warn("Socket connection error:", e);
            callback(e);
        }
    },
    send: function(type) {
        var data = Array.prototype.slice.call(arguments, 1);

        if (type === "6" && data[0]) {
            const curseWords = [
                "cunt", "whore", "fuck", "shit", "faggot", "nigger", "nigga", "dick", "vagina", "minge",
                "cock", "rape", "cum", "sex", "tits", "penis", "clit", "pussy", "meatcurtain", "jizz",
                "prune", "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"
            ];
            const cursePattern = curseWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
            const curseRegex = new RegExp(cursePattern, 'g');

            data[0] = data[0].replace(curseRegex, match => match[0] + '\0' + match.slice(1)).slice(0, 30);
        }

        var binary;
        if (pktState && pktState.mode === pktModeObf) {
            var code = pktState.tables.c2s.enc[type];
            if (code === undefined) return;
            var payload = msgpack.encode([code, data, ++pktState.seq]);
            var mac = pktMac(pktState.key, payload);
            binary = new Uint8Array(pktMacLen + payload.length);
            binary.set(mac, 0);
            binary.set(payload, pktMacLen);
        } else {
            binary = msgpack.encode([type, data]);
        }
        if (this.socket) {
            config.packets++;
            this.socket.send(binary);
            setTimeout(() => {
                config.packets--;
            }, 1000);
        }
    },
    socketReady: function() {
        return (this.socket && this.connected);
    },
    close: function() {
        this.socket && this.socket.close();
        this.socket = null;
        this.connected = false;
        pktState = null;
    }
};
