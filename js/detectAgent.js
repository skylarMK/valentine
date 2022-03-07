var detectAgent = {
    userBrowser: "",
    userOs: "",
    inApp: function () {
        var isApp = false;
        if( navigator.userAgent.indexOf("Line") > -1 ||
            navigator.userAgent.indexOf("FBAN") > -1 ||
            navigator.userAgent.indexOf("FBAV") > -1 ||
            navigator.userAgent.indexOf("Instagram") > -1 ||
            navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger"){
                isApp = true;
            }
        return isApp;
    },
    os: function () {
        this.userOs = "Other";
        this.userOs = navigator.userAgent.indexOf("windows nt") > -1 ? "Window" : this.userOs;
        this.userOs = navigator.userAgent.indexOf("Mac OS") > -1 ? "Mac OS" : this.userOs;
        this.userOs = navigator.userAgent.indexOf("linux") > -1 ? "Linux" : this.userOs;
        this.userOs = navigator.userAgent.indexOf("Android") > -1 ? "Android" : this.userOs;
        this.userOs = navigator.userAgent.indexOf("iPhone OS") > -1 ? "IOS" : this.userOs;
        return this.userOs;
    },
    browser: function () {
        this.userBrowser = "Other";
        this.userBrowser = navigator.userAgent.indexOf("Line") > -1 ? "Line" : this.userBrowser;
        this.userBrowser = (navigator.userAgent.indexOf("FBAN") > -1) || (navigator.userAgent.indexOf("FBAV") > -1) ? "Facebook" : this.userBrowser;
        this.userBrowser = navigator.userAgent.indexOf("Instagram") > -1 ? "Instagram" : this.userBrowser;
        this.userBrowser = navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger" ? "Wei Xin" : this.userBrowser;
        return this.userBrowser;
    },
    chromeUrl: function(url){
        if(this.inApp()){
            if(this.os() == "Android"){
                url = url.replace(location.protocol+"//","");
                url =  "intent://" + url + "#Intent;scheme=https;package=com.android.chrome;end";
            }
            else{
                // url =  "googlechromes://" + url ;
                // url =  url + "?openExternalBrowser=1" ;
            }
        }
        return url;
    }
};
