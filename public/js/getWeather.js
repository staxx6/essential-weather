let renderNewWeather = (data) => {
    document.getElementById("weather-currently-temp-data").innerHTML = data.currently.temp;
    document.getElementById("weather-currently-tempMax-data").innerHTML = data.currently.tempMax;
    document.getElementById("weather-currently-tempMin-data").innerHTML = data.currently.tempMin;
    document.getElementById("weather-currently-icon-data").innerHTML = data.currently.icon;
    document.getElementById("weather-currently-precipProbability-data").innerHTML = data.currently.precipProbability;
};

let testWeather = () => {
    renderNewWeather({
        status: 'ok',
        currently: {
            time: 5000,
            timeDay: new Date(500000),
            temp: `500°C`,
            tempMax: `500°C`,
            tempMin: `500°C`,
            icon: 'testIco',
            precipProbability: `120%`
        },
        hours: [
            {
                name: 'weather-hour',
                time: new Date(5000000)

            }
        ],

    });
}

let showWorkingAnimation = () => {

};

// TODO: set id for fetchAnimation or the actual animation
let newLoc = () => {
    document.getElementById("fetchAnimation").style.display = 'inline-block';
    input = document.getElementById("location-input").value.replace(" ", "%20");

    let request = new XMLHttpRequest();
    request.onreadystatechange = (data) => {
        console.log(XMLHttpRequest)
        if (request.readyState === XMLHttpRequest.DONE) {
            let data = JSON.parse(request.responseText);
            if (data.status !== 'ok') {
                document.getElementById("fetchAnimation").style.background = 'red';
                return;
            }
            console.log(data);
            renderNewWeather(data);
            document.getElementById("fetchAnimation").style.display = 'none';
            document.getElementById("fetchAnimation").style.background = 'red';
        }
    }

    let encodedInput = input;

    request.open('GET', `http://localhost:8000/${encodedInput}`, true);
    request.send();
};

document.getElementById("location-input").addEventListener("keyup", event => {
    event.preventDefault();
    if (event.keyCode === 13) {
        newLoc();
    }
});
