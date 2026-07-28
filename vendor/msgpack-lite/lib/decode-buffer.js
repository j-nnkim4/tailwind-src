exports.DecodeBuffer = DecodeBuffer;

var preset = __webpack_require__( "./node_modules/msgpack-lite/lib/read-core.js").preset;

var FlexDecoder = __webpack_require__( "./node_modules/msgpack-lite/lib/flex-buffer.js").FlexDecoder;

FlexDecoder.mixin(DecodeBuffer.prototype);

function DecodeBuffer(options) {
    if (!(this instanceof DecodeBuffer)) return new DecodeBuffer(options);

    if (options) {
        this.options = options;
        if (options.codec) {
            var codec = this.codec = options.codec;
            if (codec.bufferish) this.bufferish = codec.bufferish;
        }
    }
}

DecodeBuffer.prototype.codec = preset;

DecodeBuffer.prototype.fetch = function() {
    return this.codec.decode(this);
};
