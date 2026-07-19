var MAXBUFLEN = 8192;

exports.copy = copy;
exports.toString = toString;
exports.write = write;


function write(string, offset) {
    var buffer = this;
    var index = offset || (offset |= 0);
    var length = string.length;
    var chr = 0;
    var i = 0;
    while (i < length) {
        chr = string.charCodeAt(i++);

        if (chr < 128) {
            buffer[index++] = chr;
        } else if (chr < 0x800) {
            buffer[index++] = 0xC0 | (chr >>> 6);
            buffer[index++] = 0x80 | (chr & 0x3F);
        } else if (chr < 0xD800 || chr > 0xDFFF) {
            buffer[index++] = 0xE0 | (chr  >>> 12);
            buffer[index++] = 0x80 | ((chr >>> 6)  & 0x3F);
            buffer[index++] = 0x80 | (chr          & 0x3F);
        } else {
            chr = (((chr - 0xD800) << 10) | (string.charCodeAt(i++) - 0xDC00)) + 0x10000;
            buffer[index++] = 0xF0 | (chr >>> 18);
            buffer[index++] = 0x80 | ((chr >>> 12) & 0x3F);
            buffer[index++] = 0x80 | ((chr >>> 6)  & 0x3F);
            buffer[index++] = 0x80 | (chr          & 0x3F);
        }
    }
    return index - offset;
}


function toString(encoding, start, end) {
    var buffer = this;
    var index = start|0;
    if (!end) end = buffer.length;
    var string = '';
    var chr = 0;

    while (index < end) {
        chr = buffer[index++];
        if (chr < 128) {
            string += String.fromCharCode(chr);
            continue;
        }

        if ((chr & 0xE0) === 0xC0) {
            chr = (chr & 0x1F) << 6 |
                (buffer[index++] & 0x3F);

        } else if ((chr & 0xF0) === 0xE0) {
            chr = (chr & 0x0F)             << 12 |
                (buffer[index++] & 0x3F) << 6  |
                (buffer[index++] & 0x3F);

        } else if ((chr & 0xF8) === 0xF0) {
            chr = (chr & 0x07)             << 18 |
                (buffer[index++] & 0x3F) << 12 |
                (buffer[index++] & 0x3F) << 6  |
                (buffer[index++] & 0x3F);
        }

        if (chr >= 0x010000) {
            chr -= 0x010000;

            string += String.fromCharCode((chr >>> 10) + 0xD800, (chr & 0x3FF) + 0xDC00);
        } else {
            string += String.fromCharCode(chr);
        }
    }

    return string;
}


function copy(target, targetStart, start, end) {
    var i;
    if (!start) start = 0;
    if (!end && end !== 0) end = this.length;
    if (!targetStart) targetStart = 0;
    var len = end - start;

    if (target === this && start < targetStart && targetStart < end) {
        for (i = len - 1; i >= 0; i--) {
            target[i + targetStart] = this[i + start];
        }
    } else {
        for (i = 0; i < len; i++) {
            target[i + targetStart] = this[i + start];
        }
    }

    return len;
}
