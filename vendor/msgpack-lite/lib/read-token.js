var ReadFormat = __webpack_require__( "./node_modules/msgpack-lite/lib/read-format.js");

exports.getReadToken = getReadToken;

function getReadToken(options) {
    var format = ReadFormat.getReadFormat(options);

    if (options && options.useraw) {
        return init_useraw(format);
    } else {
        return init_token(format);
    }
}

function init_token(format) {
    var i;
    var token = new Array(256);

    for (i = 0x00; i <= 0x7f; i++) {
        token[i] = constant(i);
    }

    for (i = 0x80; i <= 0x8f; i++) {
        token[i] = fix(i - 0x80, format.map);
    }

    for (i = 0x90; i <= 0x9f; i++) {
        token[i] = fix(i - 0x90, format.array);
    }

    for (i = 0xa0; i <= 0xbf; i++) {
        token[i] = fix(i - 0xa0, format.str);
    }

    token[0xc0] = constant(null);

    token[0xc1] = null;

    token[0xc2] = constant(false);
    token[0xc3] = constant(true);

    token[0xc4] = flex(format.uint8, format.bin);
    token[0xc5] = flex(format.uint16, format.bin);
    token[0xc6] = flex(format.uint32, format.bin);

    token[0xc7] = flex(format.uint8, format.ext);
    token[0xc8] = flex(format.uint16, format.ext);
    token[0xc9] = flex(format.uint32, format.ext);

    token[0xca] = format.float32;
    token[0xcb] = format.float64;

    token[0xcc] = format.uint8;
    token[0xcd] = format.uint16;
    token[0xce] = format.uint32;
    token[0xcf] = format.uint64;

    token[0xd0] = format.int8;
    token[0xd1] = format.int16;
    token[0xd2] = format.int32;
    token[0xd3] = format.int64;

    token[0xd4] = fix(1, format.ext);
    token[0xd5] = fix(2, format.ext);
    token[0xd6] = fix(4, format.ext);
    token[0xd7] = fix(8, format.ext);
    token[0xd8] = fix(16, format.ext);

    token[0xd9] = flex(format.uint8, format.str);
    token[0xda] = flex(format.uint16, format.str);
    token[0xdb] = flex(format.uint32, format.str);

    token[0xdc] = flex(format.uint16, format.array);
    token[0xdd] = flex(format.uint32, format.array);

    token[0xde] = flex(format.uint16, format.map);
    token[0xdf] = flex(format.uint32, format.map);

    for (i = 0xe0; i <= 0xff; i++) {
        token[i] = constant(i - 0x100);
    }

    return token;
}

function init_useraw(format) {
    var i;
    var token = init_token(format).slice();

    token[0xd9] = token[0xc4];
    token[0xda] = token[0xc5];
    token[0xdb] = token[0xc6];

    for (i = 0xa0; i <= 0xbf; i++) {
        token[i] = fix(i - 0xa0, format.bin);
    }

    return token;
}

function constant(value) {
    return function() {
        return value;
    };
}

function flex(lenFunc, decodeFunc) {
    return function(decoder) {
        var len = lenFunc(decoder);
        return decodeFunc(decoder, len);
    };
}

function fix(len, method) {
    return function(decoder) {
        return method(decoder, len);
    };
}
