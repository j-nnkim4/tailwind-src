(function(Buffer) {





    var Uint64BE, Int64BE, Uint64LE, Int64LE;

    !function(exports) {

        var UNDEFINED = "undefined";
        var BUFFER = (UNDEFINED !== typeof Buffer) && Buffer;
        var UINT8ARRAY = (UNDEFINED !== typeof Uint8Array) && Uint8Array;
        var ARRAYBUFFER = (UNDEFINED !== typeof ArrayBuffer) && ArrayBuffer;
        var ZERO = [0, 0, 0, 0, 0, 0, 0, 0];
        var isArray = Array.isArray || _isArray;
        var BIT32 = 4294967296;
        var BIT24 = 16777216;


        var storage;


        Uint64BE = factory("Uint64BE", true, true);
        Int64BE = factory("Int64BE", true, false);
        Uint64LE = factory("Uint64LE", false, true);
        Int64LE = factory("Int64LE", false, false);


        function factory(name, bigendian, unsigned) {
            var posH = bigendian ? 0 : 4;
            var posL = bigendian ? 4 : 0;
            var pos0 = bigendian ? 0 : 3;
            var pos1 = bigendian ? 1 : 2;
            var pos2 = bigendian ? 2 : 1;
            var pos3 = bigendian ? 3 : 0;
            var fromPositive = bigendian ? fromPositiveBE : fromPositiveLE;
            var fromNegative = bigendian ? fromNegativeBE : fromNegativeLE;
            var proto = Int64.prototype;
            var isName = "is" + name;
            var _isInt64 = "_" + isName;

            proto.buffer = void 0;
            proto.offset = 0;
            proto[_isInt64] = true;

            proto.toNumber = toNumber;
            proto.toString = toString;
            proto.toJSON = toNumber;
            proto.toArray = toArray;

            if (BUFFER) proto.toBuffer = toBuffer;

            if (UINT8ARRAY) proto.toArrayBuffer = toArrayBuffer;

            Int64[isName] = isInt64;

            exports[name] = Int64;

            return Int64;

            function Int64(buffer, offset, value, raddix) {
                if (!(this instanceof Int64)) return new Int64(buffer, offset, value, raddix);
                return init(this, buffer, offset, value, raddix);
            }

            function isInt64(b) {
                return !!(b && b[_isInt64]);
            }

            function init(that, buffer, offset, value, raddix) {
                if (UINT8ARRAY && ARRAYBUFFER) {
                    if (buffer instanceof ARRAYBUFFER) buffer = new UINT8ARRAY(buffer);
                    if (value instanceof ARRAYBUFFER) value = new UINT8ARRAY(value);
                }

                if (!buffer && !offset && !value && !storage) {
                    that.buffer = newArray(ZERO, 0);
                    return;
                }

                if (!isValidBuffer(buffer, offset)) {
                    var _storage = storage || Array;
                    raddix = offset;
                    value = buffer;
                    offset = 0;
                    buffer = new _storage(8);
                }

                that.buffer = buffer;
                that.offset = offset |= 0;

                if (UNDEFINED === typeof value) return;

                if ("string" === typeof value) {
                    fromString(buffer, offset, value, raddix || 10);
                } else if (isValidBuffer(value, raddix)) {
                    fromArray(buffer, offset, value, raddix);
                } else if ("number" === typeof raddix) {
                    writeInt32(buffer, offset + posH, value);
                    writeInt32(buffer, offset + posL, raddix);
                } else if (value > 0) {
                    fromPositive(buffer, offset, value);
                } else if (value < 0) {
                    fromNegative(buffer, offset, value);
                } else {
                    fromArray(buffer, offset, ZERO, 0);
                }
            }

            function fromString(buffer, offset, str, raddix) {
                var pos = 0;
                var len = str.length;
                var high = 0;
                var low = 0;
                if (str[0] === "-") pos++;
                var sign = pos;
                while (pos < len) {
                    var chr = parseInt(str[pos++], raddix);
                    if (!(chr >= 0)) break;
                    low = low * raddix + chr;
                    high = high * raddix + Math.floor(low / BIT32);
                    low %= BIT32;
                }
                if (sign) {
                    high = ~high;
                    if (low) {
                        low = BIT32 - low;
                    } else {
                        high++;
                    }
                }
                writeInt32(buffer, offset + posH, high);
                writeInt32(buffer, offset + posL, low);
            }

            function toNumber() {
                var buffer = this.buffer;
                var offset = this.offset;
                var high = readInt32(buffer, offset + posH);
                var low = readInt32(buffer, offset + posL);
                if (!unsigned) high |= 0;
                return high ? (high * BIT32 + low) : low;
            }

            function toString(radix) {
                var buffer = this.buffer;
                var offset = this.offset;
                var high = readInt32(buffer, offset + posH);
                var low = readInt32(buffer, offset + posL);
                var str = "";
                var sign = !unsigned && (high & 0x80000000);
                if (sign) {
                    high = ~high;
                    low = BIT32 - low;
                }
                radix = radix || 10;
                while (1) {
                    var mod = (high % radix) * BIT32 + low;
                    high = Math.floor(high / radix);
                    low = Math.floor(mod / radix);
                    str = (mod % radix).toString(radix) + str;
                    if (!high && !low) break;
                }
                if (sign) {
                    str = "-" + str;
                }
                return str;
            }

            function writeInt32(buffer, offset, value) {
                buffer[offset + pos3] = value & 255;
                value = value >> 8;
                buffer[offset + pos2] = value & 255;
                value = value >> 8;
                buffer[offset + pos1] = value & 255;
                value = value >> 8;
                buffer[offset + pos0] = value & 255;
            }

            function readInt32(buffer, offset) {
                return (buffer[offset + pos0] * BIT24) +
                    (buffer[offset + pos1] << 16) +
                    (buffer[offset + pos2] << 8) +
                    buffer[offset + pos3];
            }
        }

        function toArray(raw) {
            var buffer = this.buffer;
            var offset = this.offset;
            storage = null;
            if (raw !== false && offset === 0 && buffer.length === 8 && isArray(buffer)) return buffer;
            return newArray(buffer, offset);
        }

        function toBuffer(raw) {
            var buffer = this.buffer;
            var offset = this.offset;
            storage = BUFFER;
            if (raw !== false && offset === 0 && buffer.length === 8 && Buffer.isBuffer(buffer)) return buffer;
            var dest = new BUFFER(8);
            fromArray(dest, 0, buffer, offset);
            return dest;
        }

        function toArrayBuffer(raw) {
            var buffer = this.buffer;
            var offset = this.offset;
            var arrbuf = buffer.buffer;
            storage = UINT8ARRAY;
            if (raw !== false && offset === 0 && (arrbuf instanceof ARRAYBUFFER) && arrbuf.byteLength === 8) return arrbuf;
            var dest = new UINT8ARRAY(8);
            fromArray(dest, 0, buffer, offset);
            return dest.buffer;
        }

        function isValidBuffer(buffer, offset) {
            var len = buffer && buffer.length;
            offset |= 0;
            return len && (offset + 8 <= len) && ("string" !== typeof buffer[offset]);
        }

        function fromArray(destbuf, destoff, srcbuf, srcoff) {
            destoff |= 0;
            srcoff |= 0;
            for (var i = 0; i < 8; i++) {
                destbuf[destoff++] = srcbuf[srcoff++] & 255;
            }
        }

        function newArray(buffer, offset) {
            return Array.prototype.slice.call(buffer, offset, offset + 8);
        }

        function fromPositiveBE(buffer, offset, value) {
            var pos = offset + 8;
            while (pos > offset) {
                buffer[--pos] = value & 255;
                value /= 256;
            }
        }

        function fromNegativeBE(buffer, offset, value) {
            var pos = offset + 8;
            value++;
            while (pos > offset) {
                buffer[--pos] = ((-value) & 255) ^ 255;
                value /= 256;
            }
        }

        function fromPositiveLE(buffer, offset, value) {
            var end = offset + 8;
            while (offset < end) {
                buffer[offset++] = value & 255;
                value /= 256;
            }
        }

        function fromNegativeLE(buffer, offset, value) {
            var end = offset + 8;
            value++;
            while (offset < end) {
                buffer[offset++] = ((-value) & 255) ^ 255;
                value /= 256;
            }
        }

        function _isArray(val) {
            return !!val && "[object Array]" == Object.prototype.toString.call(val);
        }

    }( true && typeof exports.nodeName !== 'string' ? exports : (this || {}));

}.call(this, __webpack_require__( "./node_modules/buffer/index.js").Buffer))
