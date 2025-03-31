const dataQueryURL = "https://script.google.com/macros/s/AKfycbxx-NZ96PYfr-f9bCb-gAu4QFJQ8TL2krCMI2BoNp_egQnY-v_WWkfUS3_iZKuajvS4/exec";
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const timerInterval = 1000;

function toggleNavDropdown() {
    document.getElementById("dropdown-container").classList.toggle("hidden");
}

function loadInterviewBlocks(interviews){
    var loader = document.getElementById("interviews-loader");
    var interviewContainer = document.getElementById("interviews-container");

    interviews.forEach(interview => {
        var title = document.createElement('div');
        title.classList.add('interview-title-div');

        var name = document.createElement('h1');
        name.classList.add('interview-name');
        name.innerText = interview[1];

        var date = document.createElement('h4');
        date.classList.add('interview-date');
        var dateInfo = new Date(interview[0]);
        date.innerText = monthNames[dateInfo.getMonth()] + " " + dateInfo.getDate() + ", " + dateInfo.getFullYear();

        // create basic block
        var interviewBlock = document.createElement('div');
        interviewBlock.classList.add('interview-block');
        title.appendChild(name);
        title.appendChild(date);
        interviewBlock.appendChild(title);
        interviewContainer.appendChild(interviewBlock);

        // will have all info if date has passed, otherwise show countdown
        if(dateInfo <= Date.now()){
            // add video component
            var vid = document.createElement('iframe');
            vid.width = 560;
            vid.height = 315;
            vid.title = interview[1];
            vid.src = interview[3];
            vid.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            vid.referrerPolicy = "strict-origin-when-cross-origin";
            vid.allowFullscreen = true;

            var videoContainer = document.createElement('div');
            videoContainer.classList.add('interview-video-container');
            videoContainer.appendChild(vid);
            interviewBlock.appendChild(videoContainer);

            // add custom description
            var desc = document.createElement('p');
            desc.classList.add('interview-description');
            desc.innerText = interview[2];
            interviewBlock.appendChild(desc);

            // add buttons with links
            var fullInterviewButton = document.createElement('button');
            fullInterviewButton.classList.add('filled-button');
            fullInterviewButton.innerText = "Full Interview"
            fullInterviewButton.onclick = "goToURL(" + interview[4] + ")";

            var artistBioButton = document.createElement('button');
            artistBioButton.classList.add('stroke-button');
            artistBioButton.innerText = "Artist Bio"
            artistBioButton.onclick = "goToURL(" + interview[5] + ")";

            var buttonContainer = document.createElement('div');
            buttonContainer.classList.add('interview-button-container');
            buttonContainer.appendChild(fullInterviewButton);
            buttonContainer.appendChild(artistBioButton);
            interviewBlock.appendChild(buttonContainer);
        } else {
            // timer countdown
            var availableIn = document.createElement('h3');
            availableIn.classList.add('countdown-label');
            availableIn.innerText = "Available in...";

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
    } catch (error) {
        loader.classList.toggle("hidden");
        err.classList.toggle("hidden");
        console.error("Failed loading from Google Apps Script: " + error.message);
    }
}

document.addEventListener("DOMContentLoaded", (event) => {
    fetchInterviewData();
});