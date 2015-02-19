(function (win) {
    win.performance = win.performance || {};
    win.performance.now = (function () {
        return performance.now ||
            performance.mozNow ||
            performance.msNow ||
            performance.oNow ||
            performance.webkitNow ||
            function () {
                return new Date().getTime();
            };
    }());

    (function () {
        var lastTime = 0, x, currTime, timeToCall, id, vendors = ['ms', 'moz', 'webkit', 'o'];
        for (x = 0; x < vendors.length && !win.requestAnimationFrame; x += 1) {
            win.requestAnimationFrame = win[vendors[x] + 'RequestAnimationFrame'];
            win.cancelAnimationFrame = win[vendors[x] + 'CancelAnimationFrame']
            || win[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!win.requestAnimationFrame) {
            win.requestAnimationFrame = function (callback) {
                currTime = win.performance.now();
                timeToCall = Math.max(0, 16 - (currTime - lastTime));
                id = win.setTimeout(function () {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }

        if (!win.cancelAnimationFrame) {
            win.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
        }
    }());
})(window);