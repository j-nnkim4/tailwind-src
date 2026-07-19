(function(Buffer) {

    module.exports =
        c(("undefined" !== typeof Buffer) && Buffer) ||
        c(this.Buffer) ||
        c(("undefined" !== typeof window) && window.Buffer) ||
        this.Buffer;

    function c(B) {
        return B && B.isBuffer && B;
    }
}.call(this, __webpack_require__( "./node_modules/buffer/index.js").Buffer))
