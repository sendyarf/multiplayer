var popupUrls = [
  "https://vidx.download",
  "https://vt.tokopedia.com/t/ZS9k4XoCvPH1S-LhIqc/",
  "https://vt.tokopedia.com/t/ZS9k4XwJsMo4k-z8fdL/",
  "https://goeco.mobi/IhQFtPLs",
  "https://goeco.mobi/b8Imhcff",
  "https://invl.io/clnscke",
  "https://invl.io/clnsckw",
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
