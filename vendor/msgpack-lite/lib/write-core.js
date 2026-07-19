var ExtBuffer = __webpack_require__( "./node_modules/msgpack-lite/lib/ext-buffer.js").ExtBuffer;
var ExtPacker = __webpack_require__( "./node_modules/msgpack-lite/lib/ext-packer.js");
var WriteType = __webpack_require__( "./node_modules/msgpack-lite/lib/write-type.js");
var CodecBase = __webpack_require__( "./node_modules/msgpack-lite/lib/codec-base.js");

CodecBase.install({
    addExtPacker: addExtPacker,
    getExtPacker: getExtPacker,
    init: init
});

exports.preset = init.call(CodecBase.preset);

function getEncoder(options) {
    var writeType = WriteType.getWriteType(options);
    return encode;

    function encode(encoder, value) {
        var func = writeType[typeof value];
        if (!func) throw new Error("Unsupported type \"" + (typeof value) + "\": " + value);
        func(encoder, value);
    }
}

function init() {
    var options = this.options;
    this.encode = getEncoder(options);

    if (options && options.preset) {
        ExtPacker.setExtPackers(this);
    }

    return this;
}

function addExtPacker(etype, Class, packer) {
    packer = CodecBase.filter(packer);
    var name = Class.name;
    if (name && name !== "Object") {
        var packers = this.extPackers || (this.extPackers = {});
        packers[name] = extPacker;
    } else {
        var list = this.extEncoderList || (this.extEncoderList = []);
        list.unshift([Class, extPacker]);
    }

    function extPacker(value) {
        if (packer) value = packer(value);
        return new ExtBuffer(value, etype);
    }
}

function getExtPacker(value) {
    var packers = this.extPackers || (this.extPackers = {});
    var c = value.constructor;
    var e = c && c.name && packers[c.name];
    if (e) return e;

    var list = this.extEncoderList || (this.extEncoderList = []);
    var len = list.length;
    for (var i = 0; i < len; i++) {
        var pair = list[i];
        if (c === pair[0]) return pair[1];
    }
}
