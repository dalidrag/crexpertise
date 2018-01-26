window.addEventListener('scroll', ProcessScroll, false);
window.addEventListener('click', SnapToSection, false);


ProcessScroll.frontMountain = document.querySelector('.parallax-layer.front');
ProcessScroll.backMountain = document.querySelector('.parallax-layer.back');

ProcessScroll.SnapButtons = document.getElementsByClassName('snap-button');
ProcessScroll.SnapButtons[0].style.backgroundColor = 'yellow';
ProcessScroll.previousSnapButton = ProcessScroll.SnapButtons[0];
ProcessScroll.previousSection = 0;

GetSection.sections = [500, 900, 1500, 2200, 2800, 3500];



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

        ProcessScroll.frontMountain.style.transform = 'translateZ(' + pageYOffset / 14 + 'px)';
        ProcessScroll.backMountain.style.transform = 'translateY(' + pageYOffset / 2 + 'px)';

    }
    else {

        ProcessScroll.frontMountain.style.transform = 'translateZ(' + 1700 / 14 + 'px)';

    }


    var section = GetSection(pageYOffset);

    if (section !== ProcessScroll.previousSection) {

        ProcessScroll.previousSnapButton.style.backgroundColor = 'yellowgreen';
        ProcessScroll.SnapButtons[section].style.backgroundColor = 'yellow';
        ProcessScroll.previousSnapButton = ProcessScroll.SnapButtons[section];
        ProcessScroll.previousSection = section;

    }
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
