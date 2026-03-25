var popupUrls = [
  "https://goeco.mobi/lAvRKlmP",
  "https://goeco.mobi/xHlSY13G",
  "https://www.effectivegatecpm.com/ib0fp7x0u?key=4df897bd6e0b7f7f0bda7765e8ddc80a",
  "https://markless.work/#blog/how-to-download-tiktok-videos-without-watermark",
  "https://invl.io/cln65au",
  "https://otieu.com/4/10581428",
  "https://agedhead.com/rnYHjl",
  "https://bjngnmedia.markless.work/en/",
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
