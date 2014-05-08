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
        value.dag = moment(value.dag);
        value.startTijd = moment(value.startTijd);
        value.stopTijd = moment(value.stopTijd);
        value.tijdGewerkt = moment.duration(value.tijdGewerkt);
        value.tijdVerplicht = moment.duration(value.tijdVerplicht);
        value.tijdVerschil = moment.duration(value.tijdVerschil);
        value.tijdVerschilEffectief = moment.duration(value.tijdVerschilEffectief);

        if (value.soortLijn == "dag") {
            voegRijToeDag(rijNummer, value.dag, value.tijdGewerkt, value.tijdVerplicht, value.tijdVerschil, value.tijdVerschilEffectief, value.startTijd, value.stopTijd);
            rijNummer += 2;
        }
        if (value.soortLijn == "week") {
            voegRijToeWeek(rijNummer, value.dag, value.tijdGewerkt, value.tijdVerplicht, value.tijdVerschil, value.tijdVerschilEffectief, value.startTijd, value.stopTijd);
            rijNummer += 1;
        }
        if (value.soortLijn == "maand") {
            voegRijToeMaand(rijNummer, value.dag, value.tijdGewerkt, value.tijdVerplicht, value.tijdVerschil, value.tijdVerschilEffectief, value.startTijd, value.stopTijd);
            rijNummer += 1;
        }
    });
}


function voegRijToeDag(rijNummer, datum, gewerkt, verplicht, verschil, verschilEffectief, gestartOm, gestoptOm) {
    var row = table.insertRow(rijNummer);
    var datumElement = row.insertCell(0);
    var verplichtElement = row.insertCell(1);
    var gewerktElement = row.insertCell(2);
    datumElement.innerHTML = ' ' + datum.format("dd DD/MM");

    gewerktElement.innerHTML = moment.utc(gewerkt.valueOf()).format("HH:mm");
    verplichtElement.innerHTML = moment.utc(verplicht.valueOf()).format("HH:mm");

    var row = table.insertRow(rijNummer + 1);
    row.className = "info";
    var infoVanDag = row.insertCell(0);
    infoVanDag.setAttribute("colspan", 8);
    infoVanDag.className = "infoVanDag" + datum.date();
    infoVanDag.style.display = "none";
}

function voegRijToeWeek(rijNummer, datum, gewerkt, verplicht, verschil, verschilEffectief, gestartOm, gestoptOm) {
    var row = table.insertRow(rijNummer);
    row.style.backgroundColor = "#E0E0DD";
    var datumElement = row.insertCell(0);
    var verplichtElement = row.insertCell(1);
    var gewerktElement = row.insertCell(2);
    datumElement.innerHTML = "<b>week</b>";
    gewerktElement.innerHTML = toonTijdInUrenEnMinuten(gewerkt);
    verplichtElement.innerHTML = toonTijdInUrenEnMinuten(verplicht);
}

function voegRijToeMaand(rijNummer, datum, gewerkt, verplicht, verschil, verschilEffectief, gestartOm, gestoptOm) {
    var row = table.insertRow(rijNummer);
    row.style.backgroundColor = "#E5F0F9";
    var datumElement = row.insertCell(0);
    var verplichtElement = row.insertCell(1);
    var gewerktElement = row.insertCell(2);

    datumElement.innerHTML = "<b>maand</b>";
    gewerktElement.innerHTML = toonTijdInUrenEnMinuten(gewerkt);
    verplichtElement.innerHTML = toonTijdInUrenEnMinuten(verplicht);
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