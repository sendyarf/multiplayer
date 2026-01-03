var popurls = [
    "https://goeco.mobi/mac2jWon",
    "https://goeco.mobi/5TWCLzdl",
    "https://goeco.mobi/Fwu7U0nI",
    "https://goeco.mobi/RV1GhssO",
    "https://goeco.mobi/v945tSWp",
    "https://www.effectivegatecpm.com/ib0fp7x0u?key=4df897bd6e0b7f7f0bda7765e8ddc80a",
    "https://t.me/EQuranIdBot/app",

    ];
    
    var lastPopupTime = 0;
    
    function openPopup() {
        var currentTime = new Date().getTime();
        var timeSinceLastPopup = currentTime - lastPopupTime;
        
        if (timeSinceLastPopup >= 600000) { // 10 menit (600000 ms)
            var randomIndex = Math.floor(Math.random() * popurls.length);
            var popupUrl = popurls[randomIndex];
            
            window.open(popupUrl, '', 'width=950,height=650,toolbar,location,status,scrollbars,menubar,resizable');
            lastPopupTime = currentTime;
        }
    }
    
    document.addEventListener("click", function() {
        openPopup();
        document.removeEventListener("click", arguments.callee);
    });
