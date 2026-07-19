exports.EncodeBuffer = EncodeBuffer;

var preset = __webpack_require__( "./node_modules/msgpack-lite/lib/write-core.js").preset;

var FlexEncoder = __webpack_require__( "./node_modules/msgpack-lite/lib/flex-buffer.js").FlexEncoder;

FlexEncoder.mixin(EncodeBuffer.prototype);

function EncodeBuffer(options) {
    if (!(this instanceof EncodeBuffer)) return new EncodeBuffer(options);

    if (options) {
        this.options = options;
        if (options.codec) {
            var codec = this.codec = options.codec;
            if (codec.bufferish) this.bufferish = codec.bufferish;
        }
    }
}

EncodeBuffer.prototype.codec = preset;

EncodeBuffer.prototype.write = function(input) {
    this.codec.encode(this, input);
};
