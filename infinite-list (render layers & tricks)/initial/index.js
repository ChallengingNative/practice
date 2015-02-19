var Adapter = {

    getCount: function () {
        return 1000;
    },

    getItem: function (index, element) {
        // create item element if it doesn't exist
        if (!element) {
            element = document.createElement('div');
            element.className = 'item';
        }

        // fill by content
        element.textContent = 'item: ' + index;

        return element;
    }
};

var container = document.querySelector('.container');

container.list = new List(container, Adapter);