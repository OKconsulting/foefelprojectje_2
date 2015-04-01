var googleMapInit = false;
function initialize() {
    if (!googleMapInit) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng('50.919812134690694', '3.1733993769739754'),
            map: new google.maps.Map(document.getElementById('myGoogleMap'), {
                center: { lat: 50.919812134690694, lng: 3.1733993769739754 },
                zoom: 16
            }),
            title: 'OKc'
        });
        googleMapInit = true;
    }
}

var mapHeight = $(document).height() / 100 * 75;
$('#myGoogleMap').css('height', mapHeight + 'px');

var mapWidth = $(document).width() / 100 * 75;
$('#myGoogleMap').css('width', mapWidth + 'px');