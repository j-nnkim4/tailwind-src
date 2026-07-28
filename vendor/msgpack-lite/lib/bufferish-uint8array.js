var Bufferish = __webpack_require__( "./node_modules/msgpack-lite/lib/bufferish.js");

var exports = module.exports = Bufferish.hasArrayBuffer ? alloc(0) : [];

exports.alloc = alloc;
exports.concat = Bufferish.concat;
exports.from = from;


function alloc(size) {
    return new Uint8Array(size);
}


function from(value) {
    if (Bufferish.isView(value)) {
        var byteOffset = value.byteOffset;
        var byteLength = value.byteLength;
        value = value.buffer;
        if (value.byteLength !== byteLength) {
            if (value.slice) {
                value = value.slice(byteOffset, byteOffset + byteLength);
            } else {
                value = new Uint8Array(value);
                if (value.byteLength !== byteLength) {
                    value = Array.prototype.slice.call(value, byteOffset, byteOffset + byteLength);
                }
            }
        }
    } else if (typeof value === "string") {
        return Bufferish.from.call(exports, value);
    } else if (typeof value === "number") {
        throw new TypeError('"value" argument must not be a number');
    }

    return new Uint8Array(value);
}
