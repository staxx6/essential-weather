let renderNewLoc = (dataString) => {
    let data = JSON.parse(dataString);
    document.getElementById("weather-today-temp-data").innerHTML = data.today.temp;
    document.getElementById("weather-today-tempMax-data").innerHTML = data.today.tempMax;
    document.getElementById("weather-today-tempMin-data").innerHTML = data.today.tempMin;
    document.getElementById("weather-today-icon-data").innerHTML = data.today.icon;
    document.getElementById("weather-today-precipProbability-data").innerHTML = data.today.precipProbability;
    // for (let i = 0; i < eles.length; i++) {
    //     eles
    // }
    // eles.forEach((value) => {
    //     switch(value) {
    //         case
    //     }
    // });
};

// var x = document.getElementsByClassName("example");
// var i;
// for (i = 0; i < x.length; i++) {
//     x[i].style.backgroundColor = "red";
// }

let newLoc = () => {
    input = document.getElementById("location-input").value;

    let request = new XMLHttpRequest();
    request.onreadystatechange = (data) => {
        if (request.readyState === XMLHttpRequest.DONE) {
            console.log(request.responseText);
            renderNewLoc(request.responseText);
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
