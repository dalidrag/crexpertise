window.addEventListener('scroll', ProcessScroll, false);
window.addEventListener('click', SnapToSection, false);


ProcessScroll.frontMountain = document.querySelector('.parallax-layer.front');
ProcessScroll.backMountain = document.querySelector('.parallax-layer.back');

ProcessScroll.SnapButtons = document.getElementsByClassName('snap-button');
ProcessScroll.SnapButtons[0].style.backgroundColor = 'yellow';
ProcessScroll.previousSnapButton = ProcessScroll.SnapButtons[0];
ProcessScroll.previousSection = 0;
var parallaxContainer = document.getElementsByClassName('parallax')[0];
ProcessScroll.parallaxContainerCoords = parallaxContainer.getBoundingClientRect();

GetSection.sections = [500, 900, 1500, 2200, 2800, 3500];

var hotSpots = [{x: 900, y: 100, width: 300}, {x: 600, y: 900, width: 400}, {x: 500, y: 1300, width: 500}];

var hotSpot = null;
for (var i = 0; i < hotSpots.length; ++i) {
    hotSpot = document.createElement('div');
    hotSpot.classList.add('hot-spot');
    hotSpot.style.left = hotSpots[i].x + 'px';
    hotSpot.style.top = hotSpots[i].y + 'px';

    parallaxContainer.appendChild(hotSpot);
}

function GetSection(yPos) {
    var i, j = 0;

    for ( i = 0; i < GetSection.sections.length; ++i ) {
        if (yPos <= GetSection.sections[i]) break;
    }
    for ( j = GetSection.sections.length - 1; j > i; --j ) {
        if (yPos > GetSection.sections[j]) return j;
    }

    return j;
}

function ProcessScroll() {

    if (pageYOffset < 1700) {

        ProcessScroll.frontMountain.style.transform = 'translateZ(' + pageYOffset / 12 + 'px)';
        ProcessScroll.backMountain.style.transform = 'translateY(' + pageYOffset / 2 + 'px)';

    }
    else {

        ProcessScroll.frontMountain.style.transform = 'translateZ(' + 1700 / 12 + 'px)';

    }


    var section = GetSection(pageYOffset);

    if (section !== ProcessScroll.previousSection) {

        ProcessScroll.previousSnapButton.style.backgroundColor = 'yellowgreen';
        ProcessScroll.SnapButtons[section].style.backgroundColor = 'yellow';
        ProcessScroll.previousSnapButton = ProcessScroll.SnapButtons[section];
        ProcessScroll.previousSection = section;

    }


    for (var i = 0; i < hotSpots.length; ++i) {
        if ( (pageYOffset + innerHeight/2 + 100) > hotSpots[i].y + ProcessScroll.parallaxContainerCoords.top )
            RevealHotSpot(document.getElementsByClassName('hot-spot')[i], hotSpots[i].width);

    }

}

function RevealHotSpot(el, targetWidth) {
    el.style.borderWidth ='1px';
    el.style.transform = 'rotate(0deg) scale(' + targetWidth / 30 + ', 8)'

    // el.classList.add('revealed');
}



function SnapToSection(evt) {
    var btnClassName = evt.target.classList[1];

    ScrollTo(document.documentElement, GetSection.sections[btnClassName[3]], 800);
}

function ScrollTo(element, to, duration) {
    var start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;

    var animateScroll = function(){
        currentTime += increment;
        var val = Math.easeInOutQuad(currentTime, start, change, duration);
        element.scrollTop = val;
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
