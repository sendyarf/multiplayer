var popurls = [
    "https://goeco.mobi/nLUcWfbr",
    "https://goeco.mobi/xqnxGyVp",
    "https://goeco.mobi/cESAGTnX",
    "https://goeco.mobi/MLyEcvKG",
    "https://goeco.mobi/MIlZFZmR",
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