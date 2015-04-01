var url;

if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
    url = "http://trs.e-ok.be/";
    //"http://time.e-ok.be/";
} else {
    url = "http://localhost:58206/";
}