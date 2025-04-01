// const names = ["Interviewee 1 TEST EST", "Interviewee 2", "Interviewee 3", "Interviewee 4", "Interviewee 5", 
//     "Interviewee 6", "Interviewee 7", "Interviewee 8", "Interviewee 9", "Interviewee 10",
//     "Interviewee 11", "Interviewee 12", "Interviewee 13", "Interviewee 14", "Interviewee 15",
//     "Interviewee 16", "Interviewee 17", "Interviewee 18", "Interviewee 19", "Interviewee 20"];
// const images = ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", ];

const interviewBubbleWidth = 200;
const numInterviews = 20;
var currentInterviewBubble = 0;
const dataQueryURL = "https://script.google.com/macros/s/AKfycbxx-NZ96PYfr-f9bCb-gAu4QFJQ8TL2krCMI2BoNp_egQnY-v_WWkfUS3_iZKuajvS4/exec";

function createInterviewBubbles() {
    var interviewRow = document.getElementById("interview-row");

    for(var i = 0; i < numInterviews; i++){
        var interviewBubble = document.createElement('div');
        interviewBubble.classList.add("interview-bubble")

        // var interviewThumbnail = document.createElement('img');
        // interviewThumbnail.classList.add("interview-thumbnail");
        // if(images[i] != "#"){
        //     interviewThumbnail.src = images[i];
        // }
        // interviewThumbnail.alt = "";

        var interviewThumbnail = document.createElement('i');
        interviewThumbnail.classList.add("fa-solid", "fa-lock", "interview-thumbnail", "interview-locked");

        var interviewCard = document.createElement('div');
        interviewCard.classList.add("interview-card");
        interviewCard.innerHTML = "---"; // names[i];

        interviewBubble.appendChild(interviewThumbnail);
        interviewBubble.appendChild(interviewCard);
        interviewRow.appendChild(interviewBubble);
    }

    loadUnlockedInterviews();
}

async function loadUnlockedInterviews() {
    const bubbles = document.getElementsByClassName("interview-bubble");
    const currDate = Date.now();

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

        var i = 0;
        const interviews = await response.json();
        interviews.forEach(interview => {
            var dateInfo = new Date(interview[0]);
            bubbles[i].getElementsByClassName("interview-card")[0].innerText = interview[1];

            var thumbnail = bubbles[i].getElementsByClassName("interview-thumbnail")[0];
            if(dateInfo <= currDate){
                thumbnail.classList.remove("interview-locked", "fa-lock");
                thumbnail.classList.add("fa-microphone");
                bubbles[i].setAttribute('onclick', "goToURL('" + interview[4] + "')");
            }
            i++;
        });
    } catch (error) {
        console.error("Failed loading from Google Apps Script: " + error.message);
    }
}

function moveInterviewRow(left) {
    // find current bubble closest to horizontal center of screen
    var bubbles = document.getElementById("interview-row").getElementsByClassName("interview-bubble");
    var closest = 0;
    var dist = Infinity;
    for(var i = 0; i < bubbles.length; i++){
        let rect = bubbles[i].getBoundingClientRect();
        let curr = Math.abs(rect.left + (rect.width / 2) - (window.innerWidth / 2));
        if (curr < dist) {
            closest = i;
            dist = curr;
        }
    }
    currentInterviewBubble = closest;

    // move to one side or the other showing more items with considering screen size
    var offset = Math.floor((window.innerWidth - 300) / interviewBubbleWidth); // offset 300 for margin and arrow buttons
    if(left){
        currentInterviewBubble -= offset;
        currentInterviewBubble = Math.max(0, currentInterviewBubble);
    } else {
        currentInterviewBubble += offset;
        currentInterviewBubble = Math.min(bubbles.length - 1, currentInterviewBubble);
    }

    bubbles[currentInterviewBubble].scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
}

function toggleNavDropdown() {
    document.getElementById("dropdown-container").classList.toggle("hidden");
}

function goToURL(url){
    console.log("visiting", url);
    // window.location.href = url;
    window.open(url, 'moreInfo');
}

document.addEventListener("DOMContentLoaded", (event) => {
    createInterviewBubbles();
});