var Bufferish = __webpack_require__( "./node_modules/msgpack-lite/lib/bufferish.js");
var Buffer = Bufferish.global;

var exports = module.exports = Bufferish.hasBuffer ? alloc(0) : [];

exports.alloc = Bufferish.hasBuffer && Buffer.alloc || alloc;
exports.concat = Bufferish.concat;
exports.from = from;


function alloc(size) {
    return new Buffer(size);
}


function from(value) {
    if (!Bufferish.isBuffer(value) && Bufferish.isView(value)) {
        value = Bufferish.Uint8Array.from(value);
    } else if (Bufferish.isArrayBuffer(value)) {
        value = new Uint8Array(value);
    } else if (typeof value === "string") {
        return Bufferish.from.call(exports, value);
    } else if (typeof value === "number") {
        throw new TypeError('"value" argument must not be a number');
    }

    if (Buffer.from && Buffer.from.length !== 1) {
        return Buffer.from(value);
    } else {
        return new Buffer(value);
    }
}
