// URL popup berdasarkan region/negara
var regionUrls = {
  // URL untuk pengguna dari Indonesia
  ID: [
    "https://goeco.mobi/DvhHfqX8",
    "https://goeco.mobi/7Ng9oida",
    "https://www.effectivegatecpm.com/ib0fp7x0u?key=4df897bd6e0b7f7f0bda7765e8ddc80a",
    "https://markless.work/id",
    "https://invl.io/cln65au",

    "https://otieu.com/4/10581428",
    "https://agedhead.com/rnYHjl",
  ],
  // URL untuk pengguna dari Malaysia
  MY: [
    "https://www.effectivegatecpm.com/ib0fp7x0u?key=4df897bd6e0b7f7f0bda7765e8ddc80a",
    "https://otieu.com/4/10581428",
    "https://agedhead.com/rnYHjl",
  ],
  // URL untuk pengguna dari Singapura
  SG: [
    "https://www.effectivegatecpm.com/ib0fp7x0u?key=4df897bd6e0b7f7f0bda7765e8ddc80a",
    "https://otieu.com/4/10581428",
    "https://agedhead.com/rnYHjl",
  ],
  // URL default untuk region lainnya
  DEFAULT: [
    "https://www.effectivegatecpm.com/ib0fp7x0u?key=4df897bd6e0b7f7f0bda7765e8ddc80a",
    "https://goresanburam.blogspot.com/2025/06/plus-ui-responsive-blogger-template.html",
    "https://otieu.com/4/10581428",
    "https://agedhead.com/rnYHjl",
  ],
};

var userCountry = null;
var lastPopupTime = 0;

// Deteksi negara pengguna menggunakan API gratis (dengan fallback)
function detectUserCountry() {
  // Primary: ipapi.co (gratis 1000 request/hari, support HTTPS)
  return fetch("https://ipapi.co/country_code/")
    .then(function (response) {
      if (!response.ok) throw new Error("ipapi.co failed");
      return response.text();
    })
    .then(function (countryCode) {
      userCountry = countryCode.trim() || "DEFAULT";
      console.log("User country detected:", userCountry);
      return userCountry;
    })
    .catch(function (error) {
      console.log("Primary API failed, trying fallback...");
      // Fallback: ipinfo.io (gratis 50k request/bulan)
      return fetch("https://ipinfo.io/country")
        .then(function (response) {
          return response.text();
        })
        .then(function (countryCode) {
          userCountry = countryCode.trim() || "DEFAULT";
          console.log("User country detected (fallback):", userCountry);
          return userCountry;
        })
        .catch(function (error2) {
          console.log("All APIs failed, using default");
          userCountry = "DEFAULT";
          return userCountry;
        });
    });
}

// Ambil URL list berdasarkan negara pengguna
function getUrlsForCountry(country) {
  return regionUrls[country] || regionUrls["DEFAULT"];
}

function openPopup() {
  var currentTime = new Date().getTime();
  var timeSinceLastPopup = currentTime - lastPopupTime;

  if (timeSinceLastPopup >= 600000) {
    // 10 menit (600000 ms)
    var popurls = getUrlsForCountry(userCountry);
    var randomIndex = Math.floor(Math.random() * popurls.length);
    var popupUrl = popurls[randomIndex];

    window.open(
      popupUrl,
      "",
      "width=950,height=650,toolbar,location,status,scrollbars,menubar,resizable"
    );
    lastPopupTime = currentTime;
  }
}

// Deteksi negara saat halaman dimuat
detectUserCountry();

document.addEventListener("click", function () {
  openPopup();
  document.removeEventListener("click", arguments.callee);
});
