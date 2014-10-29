var url;

if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
    url = "http://trs.e-ok.be/";
    if(new Date() >= new Date(2014, 10, 3, 2, 0, 0, 0))
        url = "http://time.e-ok.be/";
} else {
    url = "http://localhost:58205/";
}