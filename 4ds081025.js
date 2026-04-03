var popupUrls = [
  "https://goeco.mobi/O2ZVK8G3",
  "https://goeco.mobi/aTThFwd6",
  "https://markless.work/#blog/how-to-download-tiktok-videos-without-watermark",
  "https://bjngn.fyi/en/tools/video-fps-changer",
  "https://goeco.mobi/QB3nJBYZ",
  "https://goeco.mobi/ZXe2cViC",
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
