var ieee754 = __webpack_require__( "./node_modules/ieee754/index.js");
var Int64Buffer = __webpack_require__( "./node_modules/int64-buffer/int64-buffer.js");
var Uint64BE = Int64Buffer.Uint64BE;
var Int64BE = Int64Buffer.Int64BE;

var uint8 = __webpack_require__( "./node_modules/msgpack-lite/lib/write-uint8.js").uint8;
var Bufferish = __webpack_require__( "./node_modules/msgpack-lite/lib/bufferish.js");
var Buffer = Bufferish.global;
var IS_BUFFER_SHIM = Bufferish.hasBuffer && ("TYPED_ARRAY_SUPPORT" in Buffer);
var NO_TYPED_ARRAY = IS_BUFFER_SHIM && !Buffer.TYPED_ARRAY_SUPPORT;
var Buffer_prototype = Bufferish.hasBuffer && Buffer.prototype || {};

exports.getWriteToken = getWriteToken;

function getWriteToken(options) {
    if (options && options.uint8array) {
        return init_uint8array();
    } else if (NO_TYPED_ARRAY || (Bufferish.hasBuffer && options && options.safe)) {
        return init_safe();
    } else {
        return init_token();
    }
}

function init_uint8array() {
    var token = init_token();

    token[0xca] = writeN(0xca, 4, writeFloatBE);
    token[0xcb] = writeN(0xcb, 8, writeDoubleBE);

    return token;
}


function init_token() {
    var token = uint8.slice();

    token[0xc4] = write1(0xc4);
    token[0xc5] = write2(0xc5);
    token[0xc6] = write4(0xc6);

    token[0xc7] = write1(0xc7);
    token[0xc8] = write2(0xc8);
    token[0xc9] = write4(0xc9);

    token[0xca] = writeN(0xca, 4, (Buffer_prototype.writeFloatBE || writeFloatBE), true);
    token[0xcb] = writeN(0xcb, 8, (Buffer_prototype.writeDoubleBE || writeDoubleBE), true);

    token[0xcc] = write1(0xcc);
    token[0xcd] = write2(0xcd);
    token[0xce] = write4(0xce);
    token[0xcf] = writeN(0xcf, 8, writeUInt64BE);

    token[0xd0] = write1(0xd0);
    token[0xd1] = write2(0xd1);
    token[0xd2] = write4(0xd2);
    token[0xd3] = writeN(0xd3, 8, writeInt64BE);

    token[0xd9] = write1(0xd9);
    token[0xda] = write2(0xda);
    token[0xdb] = write4(0xdb);

    token[0xdc] = write2(0xdc);
    token[0xdd] = write4(0xdd);

    token[0xde] = write2(0xde);
    token[0xdf] = write4(0xdf);

    return token;
}


function init_safe() {
    var token = uint8.slice();

    token[0xc4] = writeN(0xc4, 1, Buffer.prototype.writeUInt8);
    token[0xc5] = writeN(0xc5, 2, Buffer.prototype.writeUInt16BE);
    token[0xc6] = writeN(0xc6, 4, Buffer.prototype.writeUInt32BE);

    token[0xc7] = writeN(0xc7, 1, Buffer.prototype.writeUInt8);
    token[0xc8] = writeN(0xc8, 2, Buffer.prototype.writeUInt16BE);
    token[0xc9] = writeN(0xc9, 4, Buffer.prototype.writeUInt32BE);

    token[0xca] = writeN(0xca, 4, Buffer.prototype.writeFloatBE);
    token[0xcb] = writeN(0xcb, 8, Buffer.prototype.writeDoubleBE);

    token[0xcc] = writeN(0xcc, 1, Buffer.prototype.writeUInt8);
    token[0xcd] = writeN(0xcd, 2, Buffer.prototype.writeUInt16BE);
    token[0xce] = writeN(0xce, 4, Buffer.prototype.writeUInt32BE);
    token[0xcf] = writeN(0xcf, 8, writeUInt64BE);

    token[0xd0] = writeN(0xd0, 1, Buffer.prototype.writeInt8);
    token[0xd1] = writeN(0xd1, 2, Buffer.prototype.writeInt16BE);
    token[0xd2] = writeN(0xd2, 4, Buffer.prototype.writeInt32BE);
    token[0xd3] = writeN(0xd3, 8, writeInt64BE);

    token[0xd9] = writeN(0xd9, 1, Buffer.prototype.writeUInt8);
    token[0xda] = writeN(0xda, 2, Buffer.prototype.writeUInt16BE);
    token[0xdb] = writeN(0xdb, 4, Buffer.prototype.writeUInt32BE);

    token[0xdc] = writeN(0xdc, 2, Buffer.prototype.writeUInt16BE);
    token[0xdd] = writeN(0xdd, 4, Buffer.prototype.writeUInt32BE);

    token[0xde] = writeN(0xde, 2, Buffer.prototype.writeUInt16BE);
    token[0xdf] = writeN(0xdf, 4, Buffer.prototype.writeUInt32BE);

    return token;
}

function write1(type) {
    return function(encoder, value) {
        var offset = encoder.reserve(2);
        var buffer = encoder.buffer;
        buffer[offset++] = type;
        buffer[offset] = value;
    };
}

function write2(type) {
    return function(encoder, value) {
        var offset = encoder.reserve(3);
        var buffer = encoder.buffer;
        buffer[offset++] = type;
        buffer[offset++] = value >>> 8;
        buffer[offset] = value;
    };
}

function write4(type) {
    return function(encoder, value) {
        var offset = encoder.reserve(5);
        var buffer = encoder.buffer;
        buffer[offset++] = type;
        buffer[offset++] = value >>> 24;
        buffer[offset++] = value >>> 16;
        buffer[offset++] = value >>> 8;
        buffer[offset] = value;
    };
}

function writeN(type, len, method, noAssert) {
    return function(encoder, value) {
        var offset = encoder.reserve(len + 1);
        encoder.buffer[offset++] = type;
        method.call(encoder.buffer, value, offset, noAssert);
    };
}

function writeUInt64BE(value, offset) {
    new Uint64BE(this, offset, value);
}

function writeInt64BE(value, offset) {
    new Int64BE(this, offset, value);
}

function writeFloatBE(value, offset) {
    ieee754.write(this, value, offset, false, 23, 4);
}

function writeDoubleBE(value, offset) {
    ieee754.write(this, value, offset, false, 52, 8);
}
