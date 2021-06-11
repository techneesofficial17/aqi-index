let lat, long;
const API = '0be1e7e3cfbb30443197baae89a01de7';
const token = '91dc1ea0bf60df00ea4634884603b33aac7478a8';
const mainKey = '38454c49-1624-42ed-b186-6ca981592b6c';

/// pollution values of html text ;

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
                    console.log(components);
                    co.textContent = components.co;
                    no.textContent = components.no;
                    nd.textContent = components.no2;
                    o.textContent = components.o3;
                    sd.textContent = components.so2;
                    fp.textContent = components.pm2_5;
                    am.textContent = components.nh3;
                    pm.textContent = components.pm10;
                    console.log(main.aqi);
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
    console.log('runned');
    if (search.value !== '') {
        maincontainer.innerHTML = '';

        console.log('runned');
        await fetch(
                `http://api.waqi.info/search/?token=${token}&keyword=${search.value}`
            )
            .then(data => data.json())
            .then(result => {
                let { data } = result;
                data.forEach(item => {
                    console.log(item);
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
                });
            });
    } else {
        alert('Empty Value');
    }
}

function initMap() {
    let map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 28.3949, lng: 84.124 },
        zoom: 7,
        disableDefaultUI: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: true,
        rotateControl: false,
        fullscreenControl: true,
        zoomcontrol: false,
    });
    const marker = new google.maps.Marker({
        position: myLatlng,
        map,
        title: 'click to zoom',
    });
}