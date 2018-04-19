let newLoc = () => {
    input = document.getElementById("location-input").value;

    let request = new XMLHttpRequest();
    request.onreadystatechange = (data) => {
        if (request.readyState === XMLHttpRequest.DONE) {
            console.log(request.responseText);
        }
    }

    let encodedInput = input;

    request.open('GET', `http://localhost:8000/${encodedInput}`, true);
    request.send();
}

document.getElementById("location-input").addEventListener("keyup", event => {
    event.preventDefault();
    if (event.keyCode === 13) {
        newLoc();
    }
});
