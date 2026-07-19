exports.decode = decode;

var DecodeBuffer = __webpack_require__( "./node_modules/msgpack-lite/lib/decode-buffer.js").DecodeBuffer;

function decode(input, options) {
    var decoder = new DecodeBuffer(options);
    decoder.write(input);
    return decoder.read();
}
