var timer;
var regelMedewerker;
function popup(situatie) {
    $('#containerTime > div').css('display', 'none');

    if (situatie == 'vergeten') {
        $('#containerKeuzeVergeten').fadeIn();
    } else {
        $('#containerKeuzeDoorgewerkt').fadeIn();
    }
}

function isVerplicht() {
    $("#containerLoad").show();
    $('#containerTime').hide();
    $.ajax({
        datatype: 'json',
        url: url + "/api/TijdLog/GetIsLocatieVerplicht/?id=" + mdwID + '&apiVersie=' + APIVersion,
        data: null,
        success: function (data) {
            isLocatieVerplicht = data.verplicht;
            loadData();
            getLocatie();
            /*if (isLocatieVerplicht == 'false') {
                $('#containerTime').show();
                $("#containerLoad").hide();
            }*/
        },
        error: function (e) {
            melding("De data is niet opgehaald, gelieve de pagina te herladen.");
            $("#containerLoad").hide();
        }
    });
}

function loadData() {
    $('#containerTime > div').hide();
    $('.commentaar').val('');

    $.ajax({
        datatype: 'json',
        url: url + "/api/TijdLog/GetTijdLogsVanMedewerker/" + mdwID,
        data: null,
        success: function (data) {
            tijdLogs = data;
            $.each(tijdLogs, function (index, value) {
                value['tijdstempel'] = moment(value['tijdstempel']);
            })

            clearInterval(timer);
            haalRegelOp();
        },
        error: function (e) {
            melding("De data is niet opgehaald, gelieve de pagina te herladen.");
            $("#containerLoad").hide();
        }
    });
}

function haalRegelOp() {
    $.ajax({
        datatype: 'json',
        url: url + "/api/TijdLog/GetNegPresterenMedewerker/" + mdwID,
        data: null,
        success: function (regel) {
            regelMedewerker = regel;
            tijdTeWerken = moment.duration(tijdLogs[0]['commentaar']);
            bepaalSituatie();
        },
        error: function (e) {
            alert("De data is niet opgehaald, gelieve de pagina te herladen.");
        }
    });
}

function bepaalSituatie() {
    //de eerste value in de array van tijdlogs zal het tijdstip van gisteren zijn indien vergeten of het tijdstip van vandaag als het niet vergeten is
    vandaag = moment();
    var tijdAanHetWerk = moment(0);
    $("#containerLoad").hide();

    if (tijdLogs.length == 0) {
        $('#start').fadeIn();
    } else {
        var laatsteTijdLog = tijdLogs[0];
        if (laatsteTijdLog.type == "STOP" || vandaag.day() == laatsteTijdLog.tijdstempel.day() && vandaag.week() == laatsteTijdLog.tijdstempel.week() && vandaag.month() == laatsteTijdLog.tijdstempel.month() && vandaag.year() == laatsteTijdLog.tijdstempel.year()) {
            if (tijdLogs[1] == null || tijdLogs[1]['type'] == 'STOP') {
                if (tijdLogs.length > 1) {
                    for (var i = 1; i < tijdLogs.length; i = i + 2) {
                        tijdAanHetWerk.add(tijdLogs[i]['tijdstempel'].diff(tijdLogs[i + 1]['tijdstempel']));
                    }
                    tijdAanHetWerk = tijdAanHetWerk.valueOf() - 3601000;
                    $('#tijdAanHetWerk').text(moment(tijdAanHetWerk).format("H:mm:ss"));
                    tijdTeWerken.subtract(tijdAanHetWerk, 'ms');
                    tijdTeWerken = tijdTeWerken.valueOf() - 7200000 - (regelMedewerker * 3600000);
                    if (tijdTeWerken <= -3600000)
                        tijdTeWerken = -3600000;

                    $('#tijdTeWerkenStart').text(moment(tijdTeWerken).format("H:mm:ss"));
                    $('#containerStart').fadeIn();
                } else {
                    $.ajax({
                        datatype: 'json',
                        url: url + "/api/TijdLog/GetWerkurenMedewerker/" + mdwID,
                        data: null,
                        success: function (data) {
                            tijdTeWerken = data * 3600000 - 3600000 - (regelMedewerker * 3600000);

                            $('#tijdTeWerkenStart').text(moment(tijdTeWerken).format("H:mm:ss"));
                            $('#containerStart').fadeIn();
                        },
                        error: function (e) {
                            melding("De data is niet opgehaald, gelieve de pagina te herladen.");
                        }
                    });
                }
            } else {
                $('#containerStop').fadeIn();
                for (var i = 0; i < tijdLogs.length; i = i + 2) {
                    tijdAanHetWerk.add(tijdLogs[i]['tijdstempel'].diff(tijdLogs[i + 1]['tijdstempel']));
                }
                tijdAanHetWerk = tijdAanHetWerk.valueOf() - 3600000;
                $('#tijdAanHetWerk').text(moment(tijdAanHetWerk).format("H:mm:ss"));
                tijdTeWerken.subtract(tijdAanHetWerk, 'ms');
                tijdTeWerken = tijdTeWerken.valueOf() - 7199000 - (regelMedewerker * 3600000);
                if (tijdTeWerken <= -3600000)
                    tijdTeWerken = -3600000;

                $("#progressbar").progressbar({
                    value: tijdAanHetWerk.valueOf(),
                    max: moment.duration(tijdLogs[0]['commentaar']).valueOf() - 3600000
                });

                $("#progressbarLabel").text(moment.utc(moment.duration(tijdLogs[0]['commentaar']).valueOf()).format("HH:mm:ss"));

                setInterval(function () {
                    tijdAanHetWerk += 1000;
                    if (tijdTeWerken > -3600000)
                        tijdTeWerken -= 1000;
                    else
                        tijdTeWerken = -3600000;
                    $('#tijdAanHetWerk').text(moment(tijdAanHetWerk).format("H:mm:ss"));
                    $('#tijdTeWerkenStop').text(moment(tijdTeWerken).format("H:mm:ss"));

                    $("#progressbar").progressbar({
                        value: tijdAanHetWerk.valueOf(),
                        max: moment.duration(tijdLogs[0]['commentaar']).valueOf() - 3600000
                    });
                }, 1000);
            }
        } else {
            var verschil = moment.duration(vandaag.diff(laatsteTijdLog.tijdstempel));
            if (verschil.days() == 0 && verschil.hours() < 8) {
                $('#containerKeuze').find("p").html("Uw laatste log dateert van <b>" + tijdLogs[0]["tijdstempel"].format("LLLL") + "</b>. <br> Bent u nog aan het werken of bent u vergeten uit te checken?");
                $('#containerKeuze').fadeIn();
                $('#optieVergeten').find("p").html("Uw laatste log dateert van <b>" + tijdLogs[0]["tijdstempel"].format("LLLL") + "</b>. <br> Tot hoe laat heeft u gewerkt op deze dag?");
                $('#optieWerkend').find("p").html("Gelieve te bevestigen dat u aan het werk bent sinds<br> <b>" + tijdLogs[0]["tijdstempel"].format("LLLL") + "</b>");
                return;
            }
            $('#containerVergeten').find("p").html("Uw laatste log dateert van <b>" + tijdLogs[0]["tijdstempel"].format("LLLL") + "</b>. <br> Tot hoe laat heeft u gewerkt op deze dag?");
            $('#containerVergeten').fadeIn();
        }
    }
}

function post(type, vergeten) {
    var tijdstempelVroeger;
    var tijdstempel = moment;
    vandaag = moment();
    commentaar = "", opmerking = "", opmerkingHR = "";

    $('.commentaar').each(function () {
        commentaar += $(this).val();
    });

    if (vergeten == "stopKeuzeVergeten") {
        opmerking = "de medewerker heeft vergeten uit te checken";
        tijdstempelVroeger = moment(tijdLogs[0]['tijdstempel']);
        tijdstempel = moment(tijdLogs[0]['tijdstempel']);

        var tijd = $('#vergetenKeuze').val();
        if (parseInt(tijd.substring(0, 2)) >= 24 || parseInt(tijd.substring(2, 4)) > 60) {
            melding("Geen geldig tijdstip opgegeven");
            return;
        }

        tijdstempel = tijdstempel.hour(tijd.substring(0, 2));
        tijdstempel = tijdstempel.minute(tijd.substring(2, 4));
        tijdstempel = tijdstempel.second(0);
        opmerkingHR = tijd.substring(0, 2) + ":" + tijd.substring(2, 4);
        if (tijdstempel < tijdstempelVroeger) {
            melding("De tijd moet later dan " + tijdstempelVroeger.hour() + "u" + tijdstempelVroeger.minute() + " zijn.");
            return;
        }
    }

    if (vergeten == "stopVergeten") {
        opmerking = "de medewerker heeft vergeten uit te checken";
        tijdstempelVroeger = moment(tijdLogs[0]['tijdstempel']);
        tijdstempel = moment(tijdLogs[0]['tijdstempel']);

        var tijd = $('#vergeten').val();
        if (parseInt(tijd.substring(0, 2)) >= 24 || parseInt(tijd.substring(2, 4)) > 60) {
            melding("Geen geldig tijdstip opgegeven");
            return;
        }

        tijdstempel = tijdstempel.hour(tijd.substring(0, 2));
        tijdstempel = tijdstempel.minute(tijd.substring(2, 4));
        tijdstempel = tijdstempel.second(0);
        opmerkingHR = tijd.substring(0, 2) + ":" + tijd.substring(2, 4);

        if (tijdstempel < tijdstempelVroeger) {
            melding("De tijd moet later dan " + tijdstempelVroeger.hour() + "u" + tijdstempelVroeger.minute() + " zijn.");
            return;
        }
    }

    if (vergeten == "stopKeuzeWerkend") {
        opmerking = "de medewerker heeft doorgewerkt tot de volgende dag";
        nacht = true;
    }

    if (latitudeLongitude == "" && opmerkingLocatie == "") {
        opmerkingLocatie = "de locatie is niet correct opgehaald kunnen worden";
    }

    var tijdlog = { tijdLogID: 0, mdwID: mdwID, tijdstempel: tijdstempel, latitudeLongitude: latitudeLongitude, commentaar: commentaar, opmerking: opmerking, type: type, nacht: nacht, opmerkingHR: opmerkingHR, opmerkingLocatie: opmerkingLocatie };

    $.ajax({
        url: url + '/api/TijdLog/PostTijdLog',
        type: 'POST',
        async: false,
        contentType: 'application/json',
        data: JSON.stringify(tijdlog),
        success: function (data) {
            loadData();
        },
        error: function (e) {
            melding("Er is iets misgegaan. Heeft u een actieve internetverbinding?");
        },
        dataType: 'json',
        contentType: "application/json"
    });
}

function getLocatie() {
    opmerkingLocatie = "";
    if (navigator.geolocation) {
        var geoSuccessHandler = function (position) {
            latitudeLongitude = position.coords.latitude + ";" + position.coords.longitude;
            $('#containerTime').show();
            $("#containerLoad").hide();
        };

        var geoErrorHandler = function (error) {
            opmerkingLocatie = "de medewerker heeft geweigert zijn geolocatie mee te geven";
            if (isLocatieVerplicht != 'false') {
                melding("U heeft gewijgerd de locatie mee te geven. <br> Gelieve de handleiding te raadplegen over hoe u dit kunt toelaten.");
            };
            $("#containerLoad").hide();
        };

        var positionOptions = {
            enableHighAccuracy: true,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(geoSuccessHandler, geoErrorHandler, positionOptions);
    } else {
        opmerkingLocatie = "de medewerker zijn toestel ondersteund geolocatie niet";
        melding("Uw browser ondersteund locatievoorziening niet. <br> Gelieve de handleiding te raadplegen.");
    }
}