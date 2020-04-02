const toCoords = async address => {
    const [response, err] = await handle(axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
            address,
            key: 'AIzaSyCuZPmaKymva7t2qEloYezKPm2Nbqf3VLE'
        }
    }));
    if (err ? .response ? .status === 400) { // address was empty
        throw new Error("The address field cannot be empty");
    } else if (response ? .data ? .results ? .length === 0) {
        throw new Error("The specified address was not found");
    }
    return response.data.results[0].geometry.location;
};