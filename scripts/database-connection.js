var url;

if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
    url = "http://trs.e-ok.be/";
    var datum = new Date(year, month, day, hours, minutes, seconds, milliseconds);
    if(new Date() >= new Date(2014, 11, 3, 2, 0, 0, 0))
        url = "http://time.e-ok.be/";
} else {
    url = "http://localhost:58205/";
}