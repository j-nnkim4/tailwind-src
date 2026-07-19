var BufferLite = __webpack_require__( "./node_modules/msgpack-lite/lib/buffer-lite.js");

exports.copy = copy;
exports.slice = slice;
exports.toString = toString;
exports.write = gen("write");

var Bufferish = __webpack_require__( "./node_modules/msgpack-lite/lib/bufferish.js");
var Buffer = Bufferish.global;

var isBufferShim = Bufferish.hasBuffer && ("TYPED_ARRAY_SUPPORT" in Buffer);
var brokenTypedArray = isBufferShim && !Buffer.TYPED_ARRAY_SUPPORT;


function copy(target, targetStart, start, end) {
    var thisIsBuffer = Bufferish.isBuffer(this);
    var targetIsBuffer = Bufferish.isBuffer(target);
    if (thisIsBuffer && targetIsBuffer) {
        return this.copy(target, targetStart, start, end);
    } else if (!brokenTypedArray && !thisIsBuffer && !targetIsBuffer &&
               Bufferish.isView(this) && Bufferish.isView(target)) {
        var buffer = (start || end != null) ? slice.call(this, start, end) : this;
        target.set(buffer, targetStart);
        return buffer.length;
    } else {
        return BufferLite.copy.call(this, target, targetStart, start, end);
    }
}


function slice(start, end) {
    var f = this.slice || (!brokenTypedArray && this.subarray);
    if (f) return f.call(this, start, end);

    var target = Bufferish.alloc.call(this, end - start);
    copy.call(this, target, 0, start, end);
    return target;
}


function toString(encoding, start, end) {
    var f = (!isBufferShim && Bufferish.isBuffer(this)) ? this.toString : BufferLite.toString;
    return f.apply(this, arguments);
}


function gen(method) {
    return wrap;

    function wrap() {
        var f = this[method] || BufferLite[method];
        return f.apply(this, arguments);
    }
}
