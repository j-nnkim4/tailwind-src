exports.Encoder = Encoder;

var EventLite = __webpack_require__( "./node_modules/event-lite/event-lite.js");
var EncodeBuffer = __webpack_require__( "./node_modules/msgpack-lite/lib/encode-buffer.js").EncodeBuffer;

function Encoder(options) {
    if (!(this instanceof Encoder)) return new Encoder(options);
    EncodeBuffer.call(this, options);
}

Encoder.prototype = new EncodeBuffer();

EventLite.mixin(Encoder.prototype);

Encoder.prototype.encode = function(chunk) {
    this.write(chunk);
    this.emit("data", this.read());
};

Encoder.prototype.end = function(chunk) {
    if (arguments.length) this.encode(chunk);
    this.flush();
    this.emit("end");
};
