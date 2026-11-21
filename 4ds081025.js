var popupUrls = [

  "https://www.youtube.com/shorts/_qyIp9lSbCc",
  "https://www.youtube.com/shorts/d1auPH_8Z5U",

];

var lastPopupTime = 0;

function openPopup() {
  var currentTime = new Date().getTime();
  if (currentTime - lastPopupTime >= 600000) {
    var randomUrl = popupUrls[Math.floor(Math.random() * popupUrls.length)];
    window.open(randomUrl, "", "width=950,height=650,toolbar,location,status,scrollbars,menubar,resizable");
    lastPopupTime = currentTime;
  }
}

document.addEventListener("click", function() {
  openPopup();
});
