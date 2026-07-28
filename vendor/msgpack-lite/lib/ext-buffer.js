exports.ExtBuffer = ExtBuffer;

var Bufferish = __webpack_require__( "./node_modules/msgpack-lite/lib/bufferish.js");

function ExtBuffer(buffer, type) {
    if (!(this instanceof ExtBuffer)) return new ExtBuffer(buffer, type);
    this.buffer = Bufferish.from(buffer);
    this.type = type;
}
