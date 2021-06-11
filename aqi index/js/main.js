var lat;
var long;
const API = '0be1e7e3cfbb30443197baae89a01de7';
const token = '91dc1ea0bf60df00ea4634884603b33aac7478a8';
const mainKey = '38454c49-1624-42ed-b186-6ca981592b6c';
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        long = position.coords.longitude;
        lat = position.coords.latitude;
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