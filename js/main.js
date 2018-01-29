jQuery.easing.def = "easeOutQuint";



window.addEventListener('scroll', ProcessScroll, false);



// For parallax scroll
ProcessScroll.frontMountain = document.querySelector('.parallax-layer.front');
ProcessScroll.backMountain = document.querySelector('.parallax-layer.back');
var parallaxContainer = document.getElementsByClassName('parallax')[0];
ProcessScroll.parallaxContainerCoords = parallaxContainer.getBoundingClientRect();



//
// For snapping buttons
//
// Snapping points in the percentage of the screen height
GetSectionNumber.sections = [30, 60, 90, 130, 150, 160];
//<editor-fold desc="Initialize snapping buttons">
// Initialize snapping buttons
ProcessScroll.previousSection = 0;
var snappingButton = null;
for (i = 0; i < GetSectionNumber.sections.length; ++i ) {

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



//
// For hotspots
//
// x and y are in the percentage of the main mountain width and height
// width is in pixels
var hotSpots = [{x: 48, y: 4.5, width: 200}, {x: 39.5, y: 46.5, width: 300}, {x: 36, y: 74.5, width: 200}];
// <editor-fold desc="Initialize hotspots" >
// Initialize hotspots
var svgSquare = null, svgRect = null, hotspotContainer = null;
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

    svgRect = document.getElementsByClassName('square')[i + 1];
    svgRect.id = 'hotspot' + i;
    svgRect.addEventListener('click', HotspotClickHandler, false);

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



/**
 * Returns section number given the scroll offset of the browser window
 * @param yPos Scroll offset of the browser window
 * @returns {section index}
 */
function GetSectionNumber(yPos) {
    var i, j;

    for ( i = 0; i < GetSectionNumber.sections.length; ++i ) {
        if (yPos <= GetSectionNumber.sections[i] * innerWidth / 100) break;
    }
    for ( j = GetSectionNumber.sections.length - 1; j > i; --j ) {
        if (yPos > GetSectionNumber.sections[j] * innerWidth / 100) return j;
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
    var section = GetSectionNumber(pageYOffset);

    if (section !== ProcessScroll.previousSection) {

        ProcessScroll.previousSnapButton.style.backgroundColor = 'yellowgreen';
        ProcessScroll.SnapButtons[section].style.backgroundColor = 'yellow';
        ProcessScroll.previousSnapButton = ProcessScroll.SnapButtons[section];
        ProcessScroll.previousSection = section;

    }

    // Hotspots
    for (var i = 0; i < hotSpots.length; ++i) {

        if (ProcessScroll.hotspotAnimated[i]) continue;

        if ( (pageYOffset + innerHeight/2) > (hotSpots[i].y * innerWidth / 100) + ProcessScroll.parallaxContainerCoords.top ) {

            RevealHotSpot(document.getElementsByClassName('square')[i + 1], i);

            break;

        }

    }

}



/**
 * Triggers animation that opens a hotspot
 * @param el  svg element to start animating
 * @param index  index of element in the array of all SVG hotspots on the page, including blueprint at index 0
 */
function RevealHotSpot(el, index) {

    var svgRotateAnimation, svgScaleAnimation, svgStrokeAnimation;

    el.removeAttribute('transform');
    el.classList.add('revealed');

    svgRotateAnimation = ProcessScroll.svgRotateAnimations[index + 1]; // index zero is invisible svg blueprint
    svgScaleAnimation = ProcessScroll.svgScaleAnimations[index + 1];
    svgStrokeAnimation = ProcessScroll.svgStrokeAnimations[index + 1];

    svgRotateAnimation.beginElement();
    svgScaleAnimation.beginElement();
    svgStrokeAnimation.beginElement();
    ProcessScroll.hotspotAnimated[index] = true;

}



function HotspotClickHandler(evt) {

    var index = +evt.target.id[7]; // Get index of hotspot
    RevealHotSpot(evt.target, index);

}


/**
 * Scrolls to section on snapping button click
 * @param evt
 */
function SnapToSection(evt) {

    evt.stopPropagation();
    var btnClassName = evt.target.classList[1];

    $("html, body").animate({ scrollTop: GetSectionNumber.sections[btnClassName[3]] * innerWidth / 100 + 'px' }, 800);

}

