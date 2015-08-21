var Event;

Event = (function () {
    var instance;

    function init() {
        var _events = [];

        return {
            $on: function (event, fn) {
                (_events[event] || (_events[event] = [])).push(fn);
                return this;
            },
            $off: function (event, fn) {
                if (!arguments.length) {
                    _events = [];
                    return this;
                }
                if (arguments.length == 1) {
                    _events[event] = null;
                    return this;
                }

                var events = _events[event];
                for (var i = 0; i < events.length; i++) {
                    if (events[i] === fn || events[i].fn === fn) {
                        event.splice(i, 1);
                        break;
                    }
                }
                return this;
            },
            $emit: function (event) {
                var events = _events[event];
                if (events) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    for (var i = 0; i < events.length; i++) {
                        events[i].apply(this, args);
                    }
                }
                return this;
            }
        }
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    };
})();

