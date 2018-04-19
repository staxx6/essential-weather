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
        return res.data.results[resultNr].geometry.location;
    } catch (err) {
        throw new Error(`Couldn\'t fetch geolocation for ${input}`);
    }
}

module.exports = {
    getGeoLocationCoord
}
