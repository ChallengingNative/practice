var START_MARGIN = 90;

var container = document.querySelector('.container');
var nav = document.querySelector('.nav');
var overlay = document.querySelector('.overlay');

var startCursPos = 0; // start cursor position
var startNavPos = 0; // start navigation position
var navPosition;

var isPointerDown = false;

function setNavPosition (position) {
    navPosition = position;
    nav.style.left = position + 'px';
}

function getNavPosition () {
    if (navPosition === undefined) {
        navPosition = nav.getBoundingClientRect().left;
    }

    return navPosition;
}

function setOverlay (position) {
    var opacity = (1 + (position / 160));
    opacity = (opacity > 0.7) ? 0.7 : opacity;

    overlay.style.backgroundColor = 'rgba(0,0,0,' + opacity + ')';
}

function onDown(e) {
    startNavPos = getNavPosition();
    startCursPos = e.clientX;

    // check start position
    if (startCursPos > START_MARGIN && startNavPos !== 0) {
        return;
    }

    isPointerDown = true;
    overlay.style.display = 'block';

    setOverlay(getNavPosition());
}

function onMove(e) {
    if (!isPointerDown) return;

    var position = startNavPos + (e.clientX - startCursPos);
    if (position > 0) {
        position = 0;
    }

    setNavPosition(position);
    setOverlay(getNavPosition());
}

function onUp(e) {
    if (!isPointerDown) return;

    isPointerDown = false;
    tweakNav();
}

function tweakNav() {
    var rect = nav.getBoundingClientRect();
    var newPosition = 0;

    if (-getNavPosition() > rect.width / 2) {
        newPosition = -rect.width;
        overlay.style.display = 'none';
    }

    setNavPosition(newPosition);
    setOverlay(getNavPosition());
}

// enable pointer events for container and children
var pointer = new PointerTracker(container);

// attach callbacks
container.addEventListener('pointerdown', onDown, false);
container.addEventListener('pointermove', onMove, false);
container.addEventListener('pointerup', onUp, false);
