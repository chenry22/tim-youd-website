const interviewBubbleWidth = 200;
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const numInterviews = 14;

var currentInterviewBubble = 0;
const dataQueryURL = "https://script.google.com/macros/s/AKfycbxx-NZ96PYfr-f9bCb-gAu4QFJQ8TL2krCMI2BoNp_egQnY-v_WWkfUS3_iZKuajvS4/exec";

function createInterviewBubbles() {
    var interviewRow = document.getElementById("interview-row");

    for(var i = 0; i < numInterviews; i++){
        var interviewBubble = document.createElement('div');
        interviewBubble.classList.add("interview-bubble")

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
        interviews.forEach(interview => { // date, name, vid, audio, personal link
            var dateInfo = new Date(interview[0]);
            if(dateInfo <= currDate){
                var thumbnail = bubbles[i].getElementsByClassName("interview-thumbnail")[0];
                var name = interview[1];
                bubbles[i].getElementsByClassName("interview-card")[0].innerText = name;
                
                var img = document.createElement('img');
                img.classList.add("interview-thumbnail");
                img.src = "/images/thumbnails/" + name.toLowerCase().replace(/\s/g, '-') + ".png";
                img.alt = name;
                
                thumbnail.replaceWith(img);
                bubbles[i].setAttribute('onclick', "showFullImage('" + name + "', '" + interview[3] + "')");
            } else {
                var dateTxt = "[ " + monthNames[dateInfo.getMonth()] + " " + dateInfo.getDate() + " ]";
                bubbles[i].getElementsByClassName("interview-card")[0].innerText = dateTxt;
            }
            i++;
        });
    } catch (error) {
        console.error("Failed loading from Google Apps Script: " + error.message);
    }
}

function showFullImage(name, audioLink) {
    // set buttons to appropriate onclick
    document.getElementById('full-interview-button').setAttribute('onclick', "window.location.href='interviews.html?interview=" + name.toLowerCase().replace(/\s/g, '-') + "';");

    // toggle image overlay (toggle hidden attribute)
    document.getElementById('popup-img').setAttribute('src', "images/tiles/" + name.toLowerCase().replace(/\s/g, '-') + ".png");
    document.getElementById('popup-img').setAttribute('alt', name);
    document.getElementById('popup').classList.toggle('hidden');
}
function closeFullImage() {
    document.getElementById('popup').classList.toggle('hidden');
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

    document.getElementById('popup').addEventListener('click', function (e) {
        if (!document.getElementById('popup').classList.contains('hidden') && e.target === this) {
            closeFullImage();
        }
    });
});
