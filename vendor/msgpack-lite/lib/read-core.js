var ExtBuffer = __webpack_require__( "./node_modules/msgpack-lite/lib/ext-buffer.js").ExtBuffer;
var ExtUnpacker = __webpack_require__( "./node_modules/msgpack-lite/lib/ext-unpacker.js");
var readUint8 = __webpack_require__( "./node_modules/msgpack-lite/lib/read-format.js").readUint8;
var ReadToken = __webpack_require__( "./node_modules/msgpack-lite/lib/read-token.js");
var CodecBase = __webpack_require__( "./node_modules/msgpack-lite/lib/codec-base.js");

CodecBase.install({
    addExtUnpacker: addExtUnpacker,
    getExtUnpacker: getExtUnpacker,
    init: init
});

exports.preset = init.call(CodecBase.preset);

function getDecoder(options) {
    var readToken = ReadToken.getReadToken(options);
    return decode;

    function decode(decoder) {
        var type = readUint8(decoder);
        var func = readToken[type];
        if (!func) throw new Error("Invalid type: " + (type ? ("0x" + type.toString(16)) : type));
        return func(decoder);
    }
}

function init() {
    var options = this.options;
    this.decode = getDecoder(options);

    if (options && options.preset) {
        ExtUnpacker.setExtUnpackers(this);
    }

    return this;
}

function addExtUnpacker(etype, unpacker) {
    var unpackers = this.extUnpackers || (this.extUnpackers = []);
    unpackers[etype] = CodecBase.filter(unpacker);
}

function getExtUnpacker(type) {
    var unpackers = this.extUnpackers || (this.extUnpackers = []);
    return unpackers[type] || extUnpacker;

    function extUnpacker(buffer) {
        return new ExtBuffer(buffer, type);
    }
}
