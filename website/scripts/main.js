const interviewBubbleWidth = 200;
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const interviewees = ["Amy Smith-Stewart", "Ed Park", "Ginger Shulick Porcella", "Brian Boucher", 
    "MK Guth", "Julia Whitehead", "Marie Schley", "Hannah Griggs & Shanna Early", 
    "Claudia Parducci", "Liesl Olson", "Mat Gleason", "Abel Alejandre", 
    "Bethany Ball", "Richard Polt", "Ashley Olson", "Allison C Meier", 
    "Maritza Lacayo", "Carolina Miranda", "Cristin Tierney"
];

var currentInterviewBubble = 0;
const dataQueryURL = "https://script.google.com/macros/s/AKfycbxx-NZ96PYfr-f9bCb-gAu4QFJQ8TL2krCMI2BoNp_egQnY-v_WWkfUS3_iZKuajvS4/exec";

function createInterviewBubbles() {
    var interviewRow = document.getElementById("interview-row");

    for(var i = 0; i < interviewees.length; i++){
        var name = interviewees[i];
        var interviewBubble = document.createElement('div');
        interviewBubble.classList.add("interview-bubble")

        var img = document.createElement('img');
        img.classList.add("interview-thumbnail");
        img.src = "/images/thumbnails/" + name.toLowerCase().replace(/\s/g, '-') + ".png";
        img.alt = name;

        var interviewCard = document.createElement('div');
        interviewCard.classList.add("interview-card");
        interviewCard.innerHTML = name;

        interviewBubble.appendChild(img);
        interviewBubble.appendChild(interviewCard);
        interviewBubble.setAttribute('onclick', "showFullImage('" + name + "')");

        interviewRow.appendChild(interviewBubble);
    }
}

function showFullImage(name) {
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
