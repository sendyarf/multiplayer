var popupUrls = [
  "https://goeco.mobi/lAvRKlmP",
  "https://goeco.mobi/xHlSY13G",
  "https://markless.work/#blog/how-to-download-tiktok-videos-without-watermark",
  "https://bjngn.fyi/en/tools/video-fps-changer",
  "https://goeco.mobi/DvhHfqX8",
  "https://goeco.mobi/7Ng9oida",
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
