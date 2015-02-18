runTest = function (testFunction, node) {
    setInterval(function () {
        var runs = 1000,
            times = new Array(runs);

        for (var repeat = 0; repeat < runs; repeat++) {
            var startTime = performance.now();
            testFunction();
            times.push((performance.now() - startTime) * 1000);
        }

        var sum = times.reduce(function (memo, value) {
            return memo + value;
        }, 0);

        sum = sum / repeat;
        sum = sum.toFixed(2);

        node ? node.innerHTML = "<h1>" + sum + "</h1><p>μs</p>" : document.body.innerHTML = "<h1>" + sum + "</h1><p>μs</p>";
    }, 1000);
}