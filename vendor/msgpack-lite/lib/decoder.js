exports.Decoder = Decoder;

var EventLite = __webpack_require__( "./node_modules/event-lite/event-lite.js");
var DecodeBuffer = __webpack_require__( "./node_modules/msgpack-lite/lib/decode-buffer.js").DecodeBuffer;

function Decoder(options) {
    if (!(this instanceof Decoder)) return new Decoder(options);
    DecodeBuffer.call(this, options);
}

Decoder.prototype = new DecodeBuffer();

EventLite.mixin(Decoder.prototype);

Decoder.prototype.decode = function(chunk) {
    if (arguments.length) this.write(chunk);
    this.flush();
};

Decoder.prototype.push = function(chunk) {
    this.emit("data", chunk);
};

Decoder.prototype.end = function(chunk) {
    this.decode(chunk);
    this.emit("end");
};
