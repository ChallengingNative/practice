var List = function (container, adapter) {

    // construction part
    this.adapter = adapter;
    this.container = container;
    this.wrapper = container.firstElementChild;
    this.items = [];
    this.invisibleItems = [];

    this.rAFStep = this.rAFStep.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.refresh = this.refresh.bind(this);

    container.addEventListener('scroll', this.onScroll, false);
    window.addEventListener('resize', this.refresh, false);

    // create of destroy method
    this.destroy = function () {
        container.removeEventListener('scroll', this.onScroll);
        window.removeEventListener('resize', this.refresh);

        this.state.inAnimation = false;
        window.cancelAnimationFrame(this.rAFID);
        this.wrapper.innerHTML = '';

        this.adapter = null;
        this.container = null;
        this.wrapper = null;
        this.items = null;
        this.invisibleItems = null;

        delete this.rAFStep;
        delete this.onScroll;
        delete this.refresh;
    };

    // update full status
    this.state = {
        inAnimation: false,
        top: 0,
        itemSize: 0,
        containerSize: 0,
        lastIndex: -1
    };
    this.refresh(true);
};

List.prototype = {

    onScroll: function () {
        // stop filling
        window.cancelAnimationFrame(this.rAFID);
        this.state.inAnimation = false;

        // give it rest
        this.rAFID = window.requestAnimationFrame(this.rAFStep);
    },

    rAFStep: function () {
        var top = this.wrapper.getBoundingClientRect().top;

        if (this.state.top !== top) {
            this.fillList(this.state.top, top);
            this.state.top = top;
        }

        // start new iteration
        if (this.state.inAnimation) {
            this.rAFID = window.requestAnimationFrame(this.rAFStep);
        }
    },

    fillList: function (lastPosition, newPosition) {
        var i, l, holder, itemsCount = this.adapter.getCount(), minVisibleIndex, maxVisibleIndex;

        // mark items as invisible
        for (i = 0, l = this.items.length; i < l; i++) {
            holder = this.items[i];
            if (holder.visible) {
                //mark on top
                if ((holder.position + this.state.itemSize + newPosition) < 0) {
                    holder.visible = false;
                    this.invisibleItems.push(holder);
                }

                //mark on bottom
                if ((holder.position + newPosition) > this.state.containerSize) {
                    holder.visible = false;
                    this.invisibleItems.push(holder);

                    if (this.state.lastIndex >= holder.index) {
                        this.state.lastIndex = holder.index - 1;
                    }
                }
            }
        }

        // find min & max real visible index
        for (i = 0, l = this.items.length; i < l; i++) {
            holder = this.items[i];
            if (holder.visible) {
                if (minVisibleIndex === undefined || holder.index < minVisibleIndex) {
                    minVisibleIndex = holder.index;
                }

                if (maxVisibleIndex === undefined || holder.index > maxVisibleIndex) {
                    maxVisibleIndex = holder.index;
                }
            }
        }

        // if we don't have visible items
        if (minVisibleIndex === undefined && maxVisibleIndex === undefined) {
            // create fake bottom index
            this.state.lastIndex = Math.min(Math.floor(Math.abs(-newPosition / this.state.itemSize)), itemsCount) || -1;
        }

        // fill bottom part by new items
        while (this.state.lastIndex < itemsCount - 1 && this.state.lastIndex * this.state.itemSize + newPosition < this.state.containerSize) {
            this.state.lastIndex += 1;
            this.applyItem(this.state.lastIndex);
        }

        // fill top part by new items
        if (typeof minVisibleIndex === 'number') {
            while (minVisibleIndex > 0 && minVisibleIndex * this.state.itemSize + newPosition > 0) {
                minVisibleIndex -= 1;
                this.applyItem(minVisibleIndex);
            }
        }

        // hide invisible items
        for (i = 0, l = this.invisibleItems.length; i < l; i++) {
            this.invisibleItems[i].item.style.left = '200%';
        }
    },

    getItemSize: function () {
        var size, item;

        item = this.adapter.getItem(0, null);
        this.wrapper.appendChild(item);

        size = item.getBoundingClientRect().height;

        this.wrapper.removeChild(item);

        return size;
    },

    setItemPosition: function (holder) {
        holder.item.style.top = holder.position + 'px';
        holder.item.style.left = '0';
    },

    createNewItemHolder: function (index) {
        var item = this.adapter.getItem(index, null), holder;

        this.wrapper.appendChild(item);
        holder = {
            item: item,
            position: 0,
            index: index,
            visible: true
        };
        this.items.push(holder);

        return holder;
    },

    applyItem: function (index) {
        var holder = this.invisibleItems.pop() || this.createNewItemHolder(index);
        holder.position = index * this.state.itemSize;
        holder.index = index;
        holder.visible = true;

        this.adapter.getItem(holder.index, holder.item);
        this.setItemPosition(holder);
    },

    refresh: function (force) {
        var delay = force ? 0 : 150;

        clearTimeout(this.refreshID);
        this.refreshID = setTimeout(function () {
            // stop filling
            window.cancelAnimationFrame(this.rAFID);
            this.state.inAnimation = false;

            // update state
            this.state.top = this.wrapper.getBoundingClientRect().top;
            this.state.itemSize = this.getItemSize();
            this.state.containerSize = this.container.offsetHeight;

            // update wrapper size
            this.wrapper.style.height = this.state.itemSize * this.adapter.getCount() + 'px';

            // recalculate items positions
            for (var i = 0, l = this.items.length; i < l; i += 1) {
                this.items[i].position = this.items[i].index * this.state.itemSize;
            }

            // fill list
            this.fillList(this.state.top, this.state.top);
        }.bind(this), delay);
    }
};