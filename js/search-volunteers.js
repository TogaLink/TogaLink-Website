const geoFireVolunteers = new geofire.GeoFire(refVolunteers);
const volunteersList = $('.nearby-volunteers-list');
const searchResults = [];
const loadingSpinner = $('.nearby-volunteers-loading-spinner');

const SearchResult = ({ name, distance, email }) => sanitize `
  <div class="nearby-volunteers-search-result">
    <address class="nearby-volunteers-search-result__contact-info">
      <center><h3 class="nearby-volunteers-search-result__name">${name}</h3></center>
      <center><h4 class="nearby-volunteers-search-result__distance">${distance.toFixed(2)} miles away</h4></center>
      <center><h4 class="nearby-volunteers-search-result__email">${email}</h4></center>
    </address>
  </div> 
`;

const Kumar = (string) => sanitize `
  <div class="nearby-volunteers-search-result">
    <address class="nearby-volunteers-search-result__contact-info">
      <center><h3 class="nearby-volunteers-search-result__name">${string}</h3></center>
    </address>
  </div> 
`;

const kmToMi = km => km * 0.62137;
const miToKm = mi => mi / 0.62137;

const search = async section => {
    // remove all stale results
    volunteersList.empty();
    searchResults.length = 0;

    loadingSpinner.show();

    const address = $(`${section} #address3`).val();
    const { lat, lng } = await toCoords(address);
    const center = [lat, lng];
    const radius = miToKm(2.5); // geofire uses km

    const geoQuery = geoFireVolunteers.query({ center, radius });
    const bool = false;
    geoQuery.on('key_entered', async(geoKey, _, distance) => {
        const key = geoKey.substring('geo'.length);
        const snapshot = await refVolunteers.child(key).once('value');
        const { name, email, phone } = snapshot.val();

        distance = kmToMi(distance);

        searchResults.push({ name, distance, email, phone });
        searchResults.sort((a, b) => a.distance - b.distance);

        volunteersList.html(
            searchResults.map(SearchResult).join(''));
        const key = geoKey.substring('geo'.length);
        const snapshot = await refVolunteers.child(key).once('value');
        const { name, email } = snapshot.val();
        if (name != null) {
            bool = true;
        }
        nearbyVolunteersList.prepend(SearchResult({ name, distance, email }));
    });

    if (!bool) {
        nearbyVolunteersList.prepend(Kumar("Contact Rishi Kumar, Email Campaign@Rishi2020.com"));
    }

    // 'ready' means query is done
    geoQuery.on('ready', () => loadingSpinner.hide());
};