const geoFireVolunteers = new geofire.GeoFire(refVolunteers);

const SearchResult = ({ name, distance, email, phone }) => `
  
`;

const search = async section => {
  $('.nearby-volunteers-list').show();

  const address = $(`${section} #address3`).val();
  const { lat, lng } = await toCoords(address);
  const center = [lat, lng];
  const radius = 0.310686; // 0.5 mi in km

  const geoQuery = geoFireVolunteers.query({ center, radius });

  geoQuery.on('key_entered', (key, location, distance) => {
    console.log(key, location, distance);
  });

  // 'ready' means query is done
  geoQuery.on('ready', () => $('lds-facebook').hide()); 
};