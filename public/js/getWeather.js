
// Currently changes only the current data
let renderNewWeather = (data) => {
    document.getElementById("weather-currently-temp-data").innerHTML = data.currently.temp;
    document.getElementById("weather-currently-tempMax-data").innerHTML = data.currently.tempMax;
    document.getElementById("weather-currently-tempMin-data").innerHTML = data.currently.tempMin;
    document.getElementById("weather-currently-icon-data").src = `..\\img\\${data.currently.iconName}.svg`;
    document.getElementById("weather-currently-precip-probability-data").innerHTML = data.currently.precipProbability;
};

let browserLoc = () => {

};

let testWeather = () => {
//old stuff use one from server
}

let showWorkingAnimation = () => {

};

// TODO: set id for fetchAnimation or the actual animation
let newLoc = () => {
    document.getElementById("fetch-animation").style.background = 'orange';
    document.getElementById("fetch-animation").style.display = 'inline-block';
    input = document.getElementById("location-input").value.replace(" ", "%20");

    let request = new XMLHttpRequest();
    request.onreadystatechange = (data) => {
        if (request.readyState === XMLHttpRequest.DONE) {
            let data = JSON.parse(request.responseText);
            if (data.status !== 'ok') {
                document.getElementById("fetch-animation").style.background = 'red';
                return;
            }
            renderNewWeather(data);
            document.getElementById("fetch-animation").style.display = 'none';
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
