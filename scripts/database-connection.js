﻿//var url = "http://localhost:58205/";
//var url = "http://trs.e-ok.be/";

var url;

if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
    url = "http://trs.e-ok.be/";
} else {
    url = "http://localhost:58205/";
}