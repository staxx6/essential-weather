require('./config/config');

const axios = require('axios');

const getGeoLocationCoord = async (input, resultNr) => {
    if (!input) return null;
    if (!resultNr) resultNr = 0;

    try {
        const googleMapsToken = process.env.MAPSTOKEN;
        const googleMapsUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${input}&key=${googleMapsToken}`
        const res = await axios.get(googleMapsUrl);
        console.log(res.data.results[0].formatted_address);
        let geoLocation = {
            lat: res.data.results[resultNr].geometry.location.lat,
            lng: res.data.results[resultNr].geometry.location.lng,
            location: res.data.results[resultNr].formatted_address
        };
        return geoLocation;
    } catch (err) {
        throw new Error(`Couldn\'t fetch geolocation for ${input}`);
    }
}

module.exports = {
    getGeoLocationCoord
}
