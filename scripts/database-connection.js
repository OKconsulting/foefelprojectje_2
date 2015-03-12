var url;

if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
    url = "http://192.168.2.16:58206/";
    //"http://time.e-ok.be/";
} else {
    url = "http://localhost:58206/";
}