var googleMapInit = false;
function initialize() {
    if (!googleMapInit) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng('51.217119', '3.223773'),
            map: new google.maps.Map(document.getElementById('myGoogleMap'), {
                center: { lat: 51.217119, lng: 3.223773 },
                zoom: 16
            }),
            title: 'OKc'
        });
        googleMapInit = true;
    }
}

$(document).ready(function () {
    var mapHeight = $(document).height() / 100 * 75;
    $('#myGoogleMap').css('height', mapHeight + 'px');

    var mapWidth = $(document).width() / 100 * 75;
    $('#myGoogleMap').css('width', mapWidth + 'px');
});