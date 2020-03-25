const toCoords = async address => {
  const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params: {
      address,
      key: 'AIzaSyCUmA1jvhKOYygqrQMVJi8IJmXuW496HGk'
    }
  });
  return response.data.results[0].geometry.location;
};
