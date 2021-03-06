let lat, long;
const API = '0be1e7e3cfbb30443197baae89a01de7';
const token = '91dc1ea0bf60df00ea4634884603b33aac7478a8';
const mainKey = '38454c49-1624-42ed-b186-6ca981592b6c';
var root = document.querySelector(':root');
const body = document.querySelector('body');
/// pollution values of html text ;
/// adding the svg into html
// const svgdiv = document.querySelector('#svgdiv');
// fetch('../nepalmap.svg').then(data => data.text()).then(response => {
//     svgdiv.innerHTML = response;
// });

let popup = document.querySelector('#popup');

async function svgmap() {
    const path = document.querySelectorAll('path');

    await fetch('../district_data.json')
        .then(data => data.json())
        .then(response => {
            let { dataProvince } = response;
            // info from real time API

            Array.from(path).forEach(item => {
                item.addEventListener('mouseover', e => {
                    let dataname = item.id;
                    dataProvince.forEach(item => {
                        if (dataname === item.districtName) {
                            console.log(item);
                            console.log('matched');
                            fetch(
                                    `http://api.openweathermap.org/data/2.5/air_pollution?lat=${item
                  .position.lat}&lon=${item.position.long}&appid=${API}`
                                )
                                .then(data => data.json())
                                .then(result => {
                                    let airitem = result.list[0].components;
                                    let aqi = result.list[0].main.aqi;
                                    if (aqi === 1) {
                                        aqiindex = 'Good';
                                    } else if (aqi === 2) {
                                        aqiindex = 'Fair';
                                    } else if (aqi === 3) {
                                        aqiindex = 'Moderate';
                                    } else if (aqi === 4) {
                                        aqiindex = 'Poor';
                                    } else {
                                        aqiindex = 'Very Poor';
                                    }
                                    console.log(aqiindex);
                                    const popup = document.querySelector('#popup');

                                    let htmlText = `
                                            <h3 class="district">${item.districtName}, ${item.province}</h3>
                                            <h3 id="aqiindex">Air Quality : ${aqiindex} </h3>
                                            <ul>
                                                <li class="pollutionValue">CO : ${airitem.co}??g/m<sup>3</sup></li>
                                                <li class="pollutionValue">NO : ${airitem.no}??g/m<sup>3</sup></li>
                                                <li class="pollutionValue">NO<sub>2</sub> : ${airitem.no2}??g/m<sup>3</sup></li>
                                                <li class="pollutionValue">O<sub>3</sub> : ${airitem.o3}??g/m<sup>3</sup></li>
                                                <li class="pollutionValue">SO<sub>2</sub> : ${airitem.so2}??g/m<sup>3</sup></li>
                                                <li class="pollutionValue">pm2_5 : ${airitem.pm2_5}??g/m<sup>3</sup></li>
                                                <li class="pollutionValue">NH<sub>3</sub> : ${airitem.pm10}??g/m<sup>3</sup></li>
                                                <li class="pollutionValue">pm10 : ${airitem.so2}??g/m<sup>3</sup></li>
                                            </ul>
                                    `;
                                    popup.innerHTML = htmlText;
                                });

                            popup.style.visibility = 'visible';
                            root.style.setProperty('--top', e.clientY + 'px');
                            root.style.setProperty('--left', e.clientX + 'px');
                        }
                    });
                });
                item.addEventListener('mouseout', () => {
                    popup.style.visibility = 'hidden';
                });
            });
        });
}

svgmap();

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
                    icon: '../sd.png',
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
                                <li class="pollutionValue">Carbon Monoxide : ${fd.co}??g/m<sup>3</sup></li>
                                <li class="pollutionValue">Nitrogen Monoxide : ${fd.no}??g/m<sup>3</sup></li>
                                <li class="pollutionValue">Nitrogen Dioxide : ${fd.no2}??g/m<sup>3</sup></li>
                                <li class="pollutionValue">Ozone : ${fd.o3}??g/m<sup>3</sup></li>
                                <li class="pollutionValue">Sulpher Dioxide : ${fd.so2}??g/m<sup>3</sup></li>
                                <li class="pollutionValue">Fine Particles Matter : ${fd.pm2_5}??g/m<sup>3</sup></li>
                                <li class="pollutionValue">Ammonia : ${fd.nh3}??g/m<sup>3</sup></li>
                                <li class="pollutionValue">PM 10 : ${fd.pm10}??g/m<sup>3</sup></li>
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