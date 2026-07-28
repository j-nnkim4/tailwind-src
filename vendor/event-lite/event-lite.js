function EventLite() {
    if (!(this instanceof EventLite)) return new EventLite();
}

(function(EventLite) {
    if (true) module.exports = EventLite;

    var LISTENERS = "listeners";

    var methods = {
        on: on,
        once: once,
        off: off,
        emit: emit
    };

    mixin(EventLite.prototype);

    EventLite.mixin = mixin;


    function mixin(target) {
        for (var key in methods) {
            target[key] = methods[key];
        }
        return target;
    }


    function on(type, func) {
        getListeners(this, type).push(func);
        return this;
    }


    function once(type, func) {
        var that = this;
        wrap.originalListener = func;
        getListeners(that, type).push(wrap);
        return that;

        function wrap() {
            off.call(that, type, wrap);
            func.apply(this, arguments);
        }
    }


    function off(type, func) {
        var that = this;
        var listners;
        if (!arguments.length) {
            delete that[LISTENERS];
        } else if (!func) {
            listners = that[LISTENERS];
            if (listners) {
                delete listners[type];
                if (!Object.keys(listners).length) return off.call(that);
            }
        } else {
            listners = getListeners(that, type, true);
            if (listners) {
                listners = listners.filter(ne);
                if (!listners.length) return off.call(that, type);
                that[LISTENERS][type] = listners;
            }
        }
        return that;

        function ne(test) {
            return test !== func && test.originalListener !== func;
        }
    }


    function emit(type, value) {
        var that = this;
        var listeners = getListeners(that, type, true);
        if (!listeners) return false;
        var arglen = arguments.length;
        if (arglen === 1) {
            listeners.forEach(zeroarg);
        } else if (arglen === 2) {
            listeners.forEach(onearg);
        } else {
            var args = Array.prototype.slice.call(arguments, 1);
            listeners.forEach(moreargs);
        }
        return !!listeners.length;

        function zeroarg(func) {
            func.call(that);
        }

        function onearg(func) {
            func.call(that, value);
        }

        function moreargs(func) {
            func.apply(that, args);
        }
    }


    function getListeners(that, type, readonly) {
        if (readonly && !that[LISTENERS]) return;
        var listeners = that[LISTENERS] || (that[LISTENERS] = {});
        return listeners[type] || (listeners[type] = []);
    }

})(EventLite);
