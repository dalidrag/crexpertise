window.addEventListener('scroll', ProcessScroll, false);

ProcessScroll.frontMountain = document.querySelector('.parallax-layer.front');
ProcessScroll.backMountain = document.querySelector('.parallax-layer.back');

ProcessScroll.previousSection = 0;
var parallaxContainer = document.getElementsByClassName('parallax')[0];
ProcessScroll.parallaxContainerCoords = parallaxContainer.getBoundingClientRect();

// Snapping points in the percentage of the screen height
GetSection.sections = [40, 60, 90, 130, 170, 210];

// x and y are in the percentage of the main mountain width and height
// width is in pixels
var hotSpots = [{x: 48, y: 4.5, width: 200}, {x: 39.5, y: 46.5, width: 300}, {x: 36, y: 74.5, width: 200}];


// <editor-fold desc="Initialize hotspots" >
// Initialize hotspots
var svgSquare = null, hotspotContainer = null;
var svgBluePrint = document.getElementsByClassName('svg-blueprint')[0];
for (var i = 0; i < hotSpots.length; ++i) {

    hotspotContainer = document.getElementById('main-mountain');
    hotspotContainer.classList.add('hot-spot');

    svgSquare = svgBluePrint.cloneNode(true);
    svgSquare.classList.remove('svg-blueprint');
    svgSquare.classList.add('svg-visible');

    svgSquare.style.left = hotSpots[i].x - 2.5 + '%';
    svgSquare.style.top = hotSpots[i].y - 3 + '%';
    hotspotContainer.appendChild(svgSquare);
}
ProcessScroll.hotSpots = document.getElementsByClassName('hot-spot');
ProcessScroll.svgRotateAnimations = document.getElementsByClassName('hotspot-animation');
ProcessScroll.svgScaleAnimations = document.getElementsByClassName('hotspot-scale-animation');
ProcessScroll.svgStrokeAnimations = document.getElementsByClassName('hotspot-stroke-animation');
ProcessScroll.hotspotAnimated = [];
ProcessScroll.svgScaleTransforms = document.getElementsByClassName('hotspot-scale-animation');
ProcessScroll.svgStrokeTransforms = document.getElementsByClassName('hotspot-stroke-animation');
for (var i = 0; i < hotSpots.length; ++i) {
    ProcessScroll.hotspotAnimated[i] = false;
    ProcessScroll.svgScaleTransforms[i + 1].setAttribute('to', String(hotSpots[i].width/28));
    ProcessScroll.svgStrokeTransforms[i + 1].setAttribute('to', String(7/(hotSpots[i].width/28)));
}
//</editor-fold>

//<editor-fold desc="Initialize snapping buttons">
// Initialize snapping buttons
var snappingButton = null;
for (i = 0; i < GetSection.sections.length; ++i ) {

    snappingButton = document.createElement('div');
    snappingButton.classList.add('snap-button');
    snappingButton.classList.add('btn' + i);
    snappingButton.addEventListener('click', SnapToSection, false);

    document.getElementById('snap-widget').appendChild(snappingButton);

}
ProcessScroll.SnapButtons = document.getElementsByClassName('snap-button');
ProcessScroll.SnapButtons[0].style.backgroundColor = 'yellow';
ProcessScroll.previousSnapButton = ProcessScroll.SnapButtons[0];
//</editor-fold>

function GetSection(yPos) {
    var i, j;

    for ( i = 0; i < GetSection.sections.length; ++i ) {
        if (yPos <= GetSection.sections[i] * innerHeight / 100) break;
    }
    for ( j = GetSection.sections.length - 1; j > i; --j ) {
        if (yPos > GetSection.sections[j] * innerHeight / 100) return j;
    }

    return j;
}

function ProcessScroll() {

    // Parallax effect
    if (pageYOffset < 1700) {

        ProcessScroll.frontMountain.style.transform = 'translateZ(' + pageYOffset / 14 + 'px)';
        ProcessScroll.backMountain.style.transform = 'translateY(' + pageYOffset / 2 + 'px)';

    }
    else {

        ProcessScroll.frontMountain.style.transform = 'translateZ(' + 1700 / 14 + 'px)';

    }

    // Snapping buttons
    var section = GetSection(pageYOffset);

    if (section !== ProcessScroll.previousSection) {

        ProcessScroll.previousSnapButton.style.backgroundColor = 'yellowgreen';
        ProcessScroll.SnapButtons[section].style.backgroundColor = 'yellow';
        ProcessScroll.previousSnapButton = ProcessScroll.SnapButtons[section];
        ProcessScroll.previousSection = section;

    }

    // Hotspots
    var svgRotateAnimation, svgScaleAnimation, svgStrokeAnimation;

    for (var i = 0; i < hotSpots.length; ++i) {

        if (ProcessScroll.hotspotAnimated[i]) continue;

        if ( (pageYOffset + innerHeight/2) > (hotSpots[i].y * innerWidth / 100) + ProcessScroll.parallaxContainerCoords.top ) {

            svgRotateAnimation = ProcessScroll.svgRotateAnimations[i + 1]; // index zero is invisible svg blueprint
            svgScaleAnimation = ProcessScroll.svgScaleAnimations[i + 1];
            svgStrokeAnimation = ProcessScroll.svgStrokeAnimations[i+1];

            document.getElementsByClassName('square')[i + 1].removeAttribute('transform');

            svgRotateAnimation.beginElement();
            svgScaleAnimation.beginElement();
            svgStrokeAnimation.beginElement();
            ProcessScroll.hotspotAnimated[i] = true;

            break;

        }

    }

}

function RevealHotSpot(el, targetWidth) {
    // el.style.transform = 'rotate(0deg) scale(' + targetWidth / 30 + ', 8)'

    // el.classList.add('revealed');
}



function SnapToSection(evt) {
    evt.stopPropagation();
    var btnClassName = evt.target.classList[1];

    // TODO for Chrome document.documentElement => document.body
    ScrollTo(document.documentElement, GetSection.sections[btnClassName[3]] * innerHeight / 100, 800);
}

function ScrollTo(element, to, duration) {
    var start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;

    var animateScroll = function(){
        currentTime += increment;
        element.scrollTop = Math.easeInOutQuad(currentTime, start, change, duration);
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
}

//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function (t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
};
