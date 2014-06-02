function loadStatistieken() {
    var maanden = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var maand = maanden[moment().month()] + " " + moment().year();
    if ($('.ui-datepicker-month').text() != "") {
        maand = $('.ui-datepicker-month').text() + " " + $('.ui-datepicker-year').text();
    }

    $.ajax({
        datatype: 'json',
        url: url + "api/TijdLog/GetTijdLogsVanMaand/?userID=" + mdwID + "&maand=" + maand,
        data: null,
        success: function (data) {
            tijdPerDag = data;
            invullenStatistieken();
            $('#load-statistieken').hide();
            $('#legende').show();
        },
        error: function (e) {
            melding("Voor deze periode zijn de statistieken niet kunnen opgehaald worden.");
        }
    });
}

function invullenStatistieken() {
    $('#tabelStatistieken tr').has('td').remove();
    rijNummer = 1;
    $.each(tijdPerDag, function (index, value) {
        value.datum = moment(value.datum);
        value.startTijd = moment(value.startTijd);
        value.stopTijd = moment(value.stopTijd);
        value.gewerkt = moment.duration(value.gewerkt);
        value.verplicht = moment.duration(value.verplicht);
        value.verschil = moment.duration(value.verschil);
        value.verschilEffectief = moment.duration(value.verschilEffectief);

        if (value.soortLijn == "dag") {
            voegRijToeDag(rijNummer, value);
        }
        rijNummer += 1;
    });
}

function voegRijToeDag(rijNummer, dag) {
    var row = table.insertRow(rijNummer);
    var datumElement = row.insertCell(0);
    var verplichtElement = row.insertCell(1);
    var gewerktElement = row.insertCell(2);

    if (dag.verlof == "feestdag" || dag.verlof == "collectief" || dag.verlof == "verlofdag") {
        row.style.backgroundColor = dag.prestatieKleur;
        row.title = dag.prestatieOmschrijving;
    }

    datumElement.innerHTML = dag.datum.format("dd DD/MM");
    if (dag.datum.day() == vandaag.day() && dag.datum.week() == vandaag.week() && dag.datum.month() == vandaag.month() && dag.datum.year() == vandaag.year()) {
        datumElement.style.backgroundColor = "#9ECBFF";
    }
    gewerktElement.innerHTML = moment.utc(dag.gewerkt.valueOf()).format("HH:mm");
    verplichtElement.innerHTML = moment.utc(dag.verplicht.valueOf()).format("HH:mm");
}

function toonTijdInUrenEnMinuten(duration) {
    if (duration < 0) {
        duration = moment.duration(duration.valueOf() * -1);
    }
    var uren = (duration.days() * 24) + duration.hours();
    var minuten = duration.minutes();
    if (uren < 10) {
        uren = "0" + uren;
    }
    if (minuten < 10) {
        minuten = "0" + minuten;
    }
    return uren + ":" + minuten;
}