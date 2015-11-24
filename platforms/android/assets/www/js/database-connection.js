// Bepalen welke url gebruikt moet worden
var url;

if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
    url = "http://trs.e-ok.be/";
} else {
    url = "http://trs.e-ok.be/";
}
// http://time.e-ok.be/             // Live
// http://localhost:58206/          // Lokaal
// http://trs.e-ok.be/              // Test
// http://192.168.2.125:58206/      // Device