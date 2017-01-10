// Bepalen welke url gebruikt moet worden
var url;

if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
    url = "https://time.e-ok.be/";
} else {
    url = "https://time.e-ok.be/";
}
// https://time.e-ok.be/            // Live
// http://localhost:58210/          // Lokaal
// http://trs.e-ok.be/              // Test
// http://192.168.2.125:58206/      // Device