var Buffer = exports.global = __webpack_require__( "./node_modules/msgpack-lite/lib/buffer-global.js");
var hasBuffer = exports.hasBuffer = Buffer && !!Buffer.isBuffer;
var hasArrayBuffer = exports.hasArrayBuffer = ("undefined" !== typeof ArrayBuffer);

var isArray = exports.isArray = __webpack_require__( "./node_modules/msgpack-lite/node_modules/isarray/index.js");
exports.isArrayBuffer = hasArrayBuffer ? isArrayBuffer : _false;
var isBuffer = exports.isBuffer = hasBuffer ? Buffer.isBuffer : _false;
var isView = exports.isView = hasArrayBuffer ? (ArrayBuffer.isView || _is("ArrayBuffer", "buffer")) : _false;

exports.alloc = alloc;
exports.concat = concat;
exports.from = from;

var BufferArray = exports.Array = __webpack_require__( "./node_modules/msgpack-lite/lib/bufferish-array.js");
var BufferBuffer = exports.Buffer = __webpack_require__( "./node_modules/msgpack-lite/lib/bufferish-buffer.js");
var BufferUint8Array = exports.Uint8Array = __webpack_require__( "./node_modules/msgpack-lite/lib/bufferish-uint8array.js");
var BufferProto = exports.prototype = __webpack_require__( "./node_modules/msgpack-lite/lib/bufferish-proto.js");


function from(value) {
    if (typeof value === "string") {
        return fromString.call(this, value);
    } else {
        return auto(this).from(value);
    }
}


function alloc(size) {
    return auto(this).alloc(size);
}


function concat(list, length) {
    if (!length) {
        length = 0;
        Array.prototype.forEach.call(list, dryrun);
    }
    var ref = (this !== exports) && this || list[0];
    var result = alloc.call(ref, length);
    var offset = 0;
    Array.prototype.forEach.call(list, append);
    return result;

    function dryrun(buffer) {
        length += buffer.length;
    }

    function append(buffer) {
        offset += BufferProto.copy.call(buffer, result, offset);
    }
}

var _isArrayBuffer = _is("ArrayBuffer");

function isArrayBuffer(value) {
    return (value instanceof ArrayBuffer) || _isArrayBuffer(value);
}


function fromString(value) {
    var expected = value.length * 3;
    var that = alloc.call(this, expected);
    var actual = BufferProto.write.call(that, value);
    if (expected !== actual) {
        that = BufferProto.slice.call(that, 0, actual);
    }
    return that;
}

function auto(that) {
    return isBuffer(that) ? BufferBuffer
    : isView(that) ? BufferUint8Array
    : isArray(that) ? BufferArray
    : hasBuffer ? BufferBuffer
    : hasArrayBuffer ? BufferUint8Array
    : BufferArray;
}

function _false() {
    return false;
}

function _is(name, key) {
    name = "[object " + name + "]";
    return function(value) {
        return (value != null) && {}.toString.call(key ? value[key] : value) === name;
    };
}
