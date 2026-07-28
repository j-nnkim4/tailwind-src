exports.encode = encode;

var EncodeBuffer = __webpack_require__( "./node_modules/msgpack-lite/lib/encode-buffer.js").EncodeBuffer;

function encode(input, options) {
    var encoder = new EncodeBuffer(options);
    encoder.write(input);
    return encoder.read();
}
