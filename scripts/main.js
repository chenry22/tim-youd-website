const names = ["Interviewee 1", "Interviewee 2", "Interviewee 3", "Interviewee 4", "Interviewee 5", 
    "Interviewee 6", "Interviewee 7", "Interviewee 8", "Interviewee 9", "Interviewee 10",
    "Interviewee 11", "Interviewee 12", "Interviewee 13", "Interviewee 14", "Interviewee 15",
    "Interviewee 16", "Interviewee 17", "Interviewee 18", "Interviewee 19", "Interviewee 20"];
const images = ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", ];

const interviewBubbleWidth = 200;
var currentInterviewBubble = 0;

// spreadsheet deployment URL: https://script.google.com/macros/s/AKfycbxzgKh-_YIh_knrjAf75VvD-ZzBqi0cX5NpGNvyq_szxXvBJHXOS58Y1RyPHdS4k4LrgQ/exec

function createInterviewBubbles() {
    var interviewRow = document.getElementById("interview-row");

    for(var i = 0; i < names.length; i++){
        var interviewBubble = document.createElement('div');
        interviewBubble.classList.add("interview-bubble")

        var interviewThumbnail = document.createElement('img');
        interviewThumbnail.classList.add("interview-thumbnail");
        interviewThumbnail.src = images[i]
        interviewThumbnail.alt = "?"

        var interviewCard = document.createElement('div');
        interviewCard.classList.add("interview-card");
        interviewCard.innerHTML = names[i];

        interviewBubble.appendChild(interviewThumbnail);
        interviewBubble.appendChild(interviewCard);
        interviewRow.appendChild(interviewBubble);
    }
}

function moveInterviewRow(left) {
    var bubbles = document.getElementById("interview-row").getElementsByClassName("interview-bubble");

    // find current bubble closest to horizontal center of screen
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
    var offset = (window.screen.width - 300) / interviewBubbleWidth; // offset 300 for margin and arrow buttons
    offset = Math.floor(offset);

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

document.addEventListener("DOMContentLoaded", (event) => {
    createInterviewBubbles();
});