// this is the only functionality this page needs
function toggleNavDropdown() {
    document.getElementById("dropdown-container").classList.toggle("hidden");
}

function goToURL(url){
    console.log("visiting", url);
    // window.location.href = url;
    window.open(url, 'moreInfo');
}