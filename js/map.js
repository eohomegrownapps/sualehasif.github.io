

axios.get('https://covidapi.info/api/v1/country/PAK/latest').then(function (res) {
    var result = res && res.data && res.data.result;
    var cases = result && result[Object.keys(result)[0]];    // result has only 1 key, the date of the last update
    var activeCases = cases && cases.confirmed - cases.recovered - cases.deaths;

    if (cases.confirmed) {
        document.getElementById('confirmed-cases-num').innerText = cases.confirmed;
    }

    if (cases.deaths) {
        document.getElementById('confirmed-deaths-num').innerText = cases.deaths;
    }

    if (cases.recovered) {
        document.getElementById('confirmed-recovered-num').innerText = cases.recovered;
    }
});

axios.get('https://storage.googleapis.com/static-covid/static/data-main-v4.json').then(function (res) {
    var pakistanData = res && res.data && res.data.regions && res.data.regions.PK;
    var dates = pakistanData && pakistanData.data && pakistanData.data.JohnsHopkins && pakistanData.data.JohnsHopkins.Date;
    var lastDate = dates && dates[dates.length - 1];
    var estimatedCases = pakistanData && pakistanData.CurrentEstimate;

    if (estimatedCases) {
        document.getElementById('estimated-infections-num').innerText = estimatedCases;
    }

    if (lastDate) {
        var dateParts = lastDate.split('-');
        if (dateParts.length === 3) {
            document.getElementById('estimated-infections-date').innerText = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
        }
    }
});

var dataMap = L.map('data').setView([25.8943, 68.5247], 7);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia3JhZGVscm9zYXJpbyIsImEiOiJjazk0ZzlmNnUwY3BmM2luMXNydjh3c3NiIn0.EwFfqUXIahSIpJ3CZcpTgw', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
}).addTo(dataMap);

L.geoJson(pakistanDistricts).addTo(dataMap);

function getColor(d) {
    return d > 1000 ? '#A10000' :
           d > 750  ? '#C80000' :
           d > 500  ? '#FF0000' :
           d > 250  ? '#FF5800' :
           d > 100  ? '#FF8C00' :
           d > 50   ? '#FFB700' :
           d > 10   ? '#FFD700' :
           d > 1    ? '#FFE300' :
                      '#EAEAEA';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

L.geoJson(pakistanDistricts, {style: style}).addTo(dataMap);