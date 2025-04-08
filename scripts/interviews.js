const dataQueryURL = "https://script.google.com/macros/s/AKfycbxx-NZ96PYfr-f9bCb-gAu4QFJQ8TL2krCMI2BoNp_egQnY-v_WWkfUS3_iZKuajvS4/exec";
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const timerInterval = 1000;

function toggleNavDropdown() {
    document.getElementById("dropdown-container").classList.toggle("hidden");
}

function loadInterviewBlocks(interviews){
    var loader = document.getElementById("interviews-loader");
    var interviewContainer = document.getElementById("interviews-container");

    interviews.forEach(interview => { // date, name, vid, audio, personal link
        var title = document.createElement('div');
        title.classList.add('interview-title-div');

        var name = document.createElement('h2');
        name.classList.add('interview-name');

        var date = document.createElement('h4');
        date.classList.add('interview-date');
        var dateInfo = new Date(interview[0]);
        date.innerText = monthNames[dateInfo.getMonth()] + " " + dateInfo.getDate() + ", " + dateInfo.getFullYear();

        if(dateInfo <= Date.now()) {
            var pfpDiv = document.createElement('div');
            pfpDiv.id = interview[1].toLowerCase().replace(/\s/g, '-');
            pfpDiv.classList.add('pfp-div');
            pfpDiv.setAttribute('onclick', "showFullImage('" + interview[1] + "', '" + interview[3] + "')");

            var pfp = document.createElement('img');
            pfp.src = "images/thumbnails/" + interview[1].toLowerCase().replace(/\s/g, '-') + ".png";
            pfp.alt = interview[1];
            pfp.classList.add("interview-block-thumbnail");
            var toggleFull = document.createElement('i');
            toggleFull.classList.add("fa-solid", "fa-up-right-and-down-left-from-center");
            pfpDiv.appendChild(pfp);
            pfpDiv.appendChild(toggleFull);

            name.innerText = interview[1];
            title.appendChild(pfpDiv);
        } else {
            name.innerText = "[ Locked ]";
        }

        // create basic block
        var interviewBlock = document.createElement('div');
        interviewBlock.classList.add('interview-block');
        var textBlock = document.createElement('div');
        textBlock.classList.add("interview-header");
        textBlock.appendChild(name);
        textBlock.appendChild(date);
        title.appendChild(textBlock);
        interviewBlock.appendChild(title);
        interviewContainer.appendChild(interviewBlock);

        // will have all info if date has passed, otherwise show countdown
        if(dateInfo <= Date.now()){
            // add video component
            var vid = document.createElement('iframe');
            vid.width = 560;
            vid.height = 315;
            vid.title = interview[1];
            vid.src = interview[2];
            vid.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            vid.referrerPolicy = "strict-origin-when-cross-origin";
            vid.allowFullscreen = true;

            var videoContainer = document.createElement('div');
            videoContainer.classList.add('interview-video-container');
            videoContainer.appendChild(vid);
            interviewBlock.appendChild(videoContainer);

            // add buttons with links // TODO: make embed instead
            var fullInterviewButton = document.createElement('button');
            fullInterviewButton.classList.add('filled-button');
            fullInterviewButton.innerText = "Full Interview"
            fullInterviewButton.setAttribute('onclick', "goToURL('" + interview[3] + "')");

            interviewBlock.appendChild(fullInterviewButton);
        } else {
            // timer countdown
            var availableIn = document.createElement('h3');
            availableIn.classList.add('countdown-label');
            availableIn.innerText = "Available in";

            var countdown = document.createElement('h1');
            getCountdown(countdown, dateInfo, null);
            countdown.classList.add('countdown-timer');
            var counter = setInterval(() => {
                getCountdown(countdown, dateInfo, counter);
            }, timerInterval);

            var countdownContainer = document.createElement('div');
            countdownContainer.classList.add("countdown-container");
            countdownContainer.appendChild(availableIn);
            countdownContainer.appendChild(countdown);
            interviewBlock.appendChild(countdownContainer);
        }
    });
    loader.classList.toggle("hidden");
    interviewContainer.classList.toggle("hidden");
}

function showFullImage(name, audioLink) {
    document.getElementById('popup-img').setAttribute('src', "images/tiles/" + name.toLowerCase().replace(/\s/g, '-') + ".png");
    document.getElementById('popup-img').setAttribute('alt', name);
    document.getElementById('popup').classList.toggle('hidden');
}
function closeFullImage() {
    document.getElementById('popup').classList.toggle('hidden');
}

// given countdown html var, update with current
function getCountdown(counterHTML, dueDate, counter){
    var now = new Date().getTime();
    var distance = dueDate.getTime() - now;

    // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    // var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    // counterHTML.innerText = days + "d " + hours + "h " + minutes + "m";
    var hours = Math.floor(distance / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / (1000));
    counterHTML.innerText = String(hours).padStart(2, '0') + ":" + String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0');

    // If the count down is finished, write some text
    if (distance < 0 && counter != null) {
        clearInterval(counter);
        counterHTML.innerText = "Unlocked! Refresh to load.";
    }
}

function goToURL(url){
    // window.location.href = url;
    window.open(url, 'moreInfo');
}

async function fetchInterviewData() {
    var loader = document.getElementById("interviews-loader");
    var err = document.getElementById("interviews-loading-error");

    try {
        const response = await fetch(dataQueryURL, {
            redirect: "follow",
            method : 'GET',
            headers: {
              'Content-Type': "text/plain;charset=utf-8"
            }});
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const interviews = await response.json();
        loadInterviewBlocks(interviews);

        // handle any requests (scroll to appropriate window)
        const urlParams = new URLSearchParams(window.location.search);
        if(urlParams.has('interview')){
            var name = urlParams.get('interview').toLowerCase().replace(/\s/g, '-');
            var scrollTo = document.getElementById(name);
            if(scrollTo != null){
                scrollTo.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
            }
        }
    } catch (error) {
        loader.classList.toggle("hidden");
        err.classList.toggle("hidden");
        console.error("Failed loading from Google Apps Script: " + error.message);
    }
}

document.addEventListener("DOMContentLoaded", (event) => {
    fetchInterviewData();

    document.getElementById('popup').addEventListener('click', function (e) {
        if (!document.getElementById('popup').classList.contains('hidden') && e.target === this) {
            closeFullImage();
        }
    });
});