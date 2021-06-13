let lat, long;
const API = '0be1e7e3cfbb30443197baae89a01de7';
const token = '91dc1ea0bf60df00ea4634884603b33aac7478a8';
const mainKey = '38454c49-1624-42ed-b186-6ca981592b6c';

/// pollution values of html text ;
/// adding the svg into html
// const svgdiv = document.querySelector('#svgdiv');
// fetch('../nepalmap.svg').then(data => data.text()).then(response => {
//     svgdiv.innerHTML = response;
// });

const co = document.getElementById('co');
const no = document.getElementById('no');
const nd = document.getElementById('nd');
const o = document.getElementById('o');
const sd = document.getElementById('sd');
const fp = document.getElementById('fp');
const am = document.getElementById('am');
const pm = document.getElementById('pm');
const aqic = document.getElementById('aqic');

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        long = position.coords.longitude;
        lat = position.coords.latitude;

        function pollutionData() {
            console.log(lat);
            console.log(long);
            fetch(
                    `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${long}&appid=${API}`
                )
                .then(data => data.json())
                .then(info => {
                    let { list } = info;
                    let { components, main } = list[0];
                    co.textContent = components.co;
                    no.textContent = components.no;
                    nd.textContent = components.no2;
                    o.textContent = components.o3;
                    sd.textContent = components.so2;
                    fp.textContent = components.pm2_5;
                    am.textContent = components.nh3;
                    pm.textContent = components.pm10;
                    if (main.aqi === 1) {
                        aqic.textContent = 'Good';
                    } else if (main.aqi === 2) {
                        aqic.textContent = 'Fair';
                    } else if (main.aqi === 3) {
                        aqic.textContent = 'Moderate';
                    } else if (main.aqi === 4) {
                        aqic.textContent = 'Poor';
                    } else {
                        aqic.textContent = 'Very Poor';
                    }
                });
        }

        pollutionData();
    });
}
// getting the dom element

const search = document.querySelector('#search');
const searchBtn = document.getElementById('searchBtnn');
const maincontainer = document.getElementById('maincontainer');
const alert = document.querySelector('.color');

// running the function

searchBtn.addEventListener('click', () => {
    runFunction();
});

// let city = prompt('Enter your city name ?');
// function starts here

// fetching the data from the API

async function runFunction() {
    if (search.value !== '') {
        maincontainer.innerHTML = '';
        await fetch(
                `http://api.waqi.info/search/?token=${token}&keyword=${search.value}`
            )
            .then(data => data.json())
            .then(result => {
                let { data } = result;
                for (let i = 0; i <= 7; i++) {
                    let item = data[i];
                    let { aqi } = item;
                    let { country, name } = item.station;
                    if (country === 'NP') {
                        country = 'Nepal';
                    }
                    if (aqi === '-') {
                        aqi = 'N/A';
                    }
                    const divbox = document.createElement('div');
                    divbox.setAttribute('class', 'itemBox');

                    var innerHtmlText = `<img src="./aqi.jpg" alt="">
                                        <div class="apiData">
                                            <p class="text">AQI : </p>
                                            <p id="aqi" class="aqi">${aqi}</p>
                                        </div>
                                        <p class="cityname">${name}</p>`;
                    divbox.innerHTML += innerHtmlText;

                    maincontainer.appendChild(divbox);
                }
            });
    } else {
        alert('Empty Value');
    }
}

async function initMap() {
    let gmap = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 28.3949, lng: 84.124 },
        zoom: 7,
        disableDefaultUI: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        rotateControl: false,
        fullscreenControl: true,
        // zoomControl: false,
        minZoom: 7,
        maxZoom: 12,
        // gestureHandling: 'none',
    });
    await fetch(`http://api.waqi.info/search/?token=${token}&keyword=nepal`)
        .then(data => data.json())
        .then(values => {
            let { data } = values;
            data.forEach(async item => {
                let lat = item.station.geo[0];
                let long = item.station.geo[1];
                let { name } = item.station;
                let aqi = item.aqi;
                if (aqi === '-') {
                    aqi = 'Calculating ... ';
                }
                const marker = new google.maps.Marker({
                    position: {
                        lat: lat,
                        lng: long,
                    },
                    icon: '../loca.png',
                    map: gmap,
                    title: 'click to zoom',
                    // draggable: true,
                    animation: google.maps.Animation.DROP,
                });
                await fetch(
                        `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${long}&appid=${API}`
                    )
                    .then(v => v.json())
                    .then(logged => {
                        let { list } = logged;
                        let fd = list[0].components;
                        const infotext = `
                        <div class="box">
                            <p style="font-weight=bold;" class="name">${name}</p>
                            <br>
                            <h4>AQI: <span style="font-size: 20px;">${aqi}</span> </h4>
                            <br>
                            <hr>
                            <h3>Air Quaity</h3>
                            <hr>
                            <br>
                            <ul>
                                <li class="pollutionValue">Carbon Monoxide : ${fd.co}μg/m<sup>3</sup></li>
                                <li class="pollutionValue">Nitrogen Monoxide : ${fd.no}μg/m<sup>3</sup></li>
                                <li class="pollutionValue">Nitrogen Dioxide : ${fd.no2}μg/m<sup>3</sup></li>
                                <li class="pollutionValue">Ozone : ${fd.o3}μg/m<sup>3</sup></li>
                                <li class="pollutionValue">Sulpher Dioxide : ${fd.so2}μg/m<sup>3</sup></li>
                                <li class="pollutionValue">Fine Particles Matter : ${fd.pm2_5}μg/m<sup>3</sup></li>
                                <li class="pollutionValue">Ammonia : ${fd.nh3}μg/m<sup>3</sup></li>
                                <li class="pollutionValue">PM 10 : ${fd.pm10}μg/m<sup>3</sup></li>
                            </ul>
                            <br>
                        </div>`;
                        const infowindow = new google.maps.InfoWindow({
                            content: infotext,
                        });
                        marker.addListener('mouseover', () => {
                            infowindow.open(gmap, marker);
                        });
                        marker.addListener('mouseout', () => {
                            infowindow.close(gmap, marker);
                        });
                    });
            });
        });
}