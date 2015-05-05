// Bepalen welke url gebruikt moet worden
var url;

if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
    url = "http://trs.e-ok.be/";

    var vandaag = new Date();
    if (vandaag >= new Date(2015, 4, 18, 0, 0, 0, 0)) {
        url = "http://time.e-ok.be/";
    }
} else {
    url = "http://localhost:58206/";
}