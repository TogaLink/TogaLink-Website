let geocoder;

// need to wait until the Google Maps library finishes loading
$(document).ready(() => (geocoder = new google.maps.Geocoder()));

const geocode = (address) =>
    new Promise((accept, reject) => {
        geocoder.geocode({
            'address': address,
            componentRestrictions: {
                country: 'US',
                administrativeArea: 'CA'
            }
        }, (result, status) => {
            if (status === 'OK') {
                accept(result);
            }
            reject(status);
        });
    });

const toCoords = async(address) => {
    const [response, err] = await handle(geocode(address));
    if (err === 'ZERO_RESULTS') {
        // address was empty
        throw new Error('The inputted address cannot be empty');
    } else if (response?.length === 0) {
        throw new Error('The specified address was not found');
    }
    return response[0].geometry.location;
};