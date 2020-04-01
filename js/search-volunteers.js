const geoFireVolunteers = new geofire.GeoFire(refVolunteers);
const volunteersList = $('.nearby-volunteers-list');
const searchResults = []; // object representation of volunteersList DOM elements
const loadingSpinner = $('.nearby-volunteers-loading-spinner');
const RADIUS = 0.5; // hard-coded radius of geoquery

// hide error message on next change of the address input field
let hideOnNextExit = false;

// workaround because 'ready' may fire before 'key_entered' (since fetching Firebase takes time)
let noResults = true;

const SearchResult = ({ name, distance, email }) => sanitize`
  <div class="nearby-volunteers-search-result">
    <address class="nearby-volunteers-search-result__contact-info">
      <center><h3 class="nearby-volunteers-search-result__name">${name}</h3></center>
      <center><h4 class="nearby-volunteers-search-result__email">${email}</h4></center>
      <center><h4 class="nearby-volunteers-search-result__distance">${distance.toFixed(2)} miles away</h4></center>
    </address>
  </div> 
`;

const SearchError = err => sanitize`
  <div class="nearby-volunteers-search-error col-md-6 col-md-offset-3">${err.message}</div>
`;

const NoVolunteersError = () => SearchError(Error(`
  No nearby volunteers found. Please contact Rishi Kumar at 
  <a href="mailto:Campaign@Rishi2020.com">Campaign@Rishi2020.com</a> 
  if you would like to request a volunteer in your area.
`));

const kmToMi = km => km * 0.62137;
const miToKm = mi => mi / 0.62137;

// hides the error once the user has changed the address value
$("#address3").on("change paste keyup", () => {
  if (hideOnNextExit) {
    volunteersList.empty();
    hideOnNextExit = false;
  }
});

const search = async section => {
    // remove all stale results
    volunteersList.empty();
    searchResults.length = 0;

    loadingSpinner.show();

    const address = $(`${section} #address3`).val();
    const [coords, err] = await handle(toCoords(address));
    if (err) {
      loadingSpinner.hide();
      volunteersList.html(SearchError(err));
      hideOnNextExit = true;
      return;
    }

    const { lat, lng } = coords;
    const center = [lat, lng];
    const radius = miToKm(RADIUS); // geofire uses km

    const geoQuery = geoFireVolunteers.query({ center, radius });

    geoQuery.on('key_entered', async(geoKey, _, distance) => {
        noResults = false;
        const key = geoKey.substring('geo'.length);
        const snapshot = await refVolunteers.child(key).once('value');
        const { name, email } = snapshot.val();

        distance = kmToMi(distance);

        searchResults.push({ name, distance, email });
        searchResults.sort((a, b) => a.distance - b.distance);

        volunteersList.html(
            searchResults.map(SearchResult).join(''));
    });

    // 'ready' means query is done
    geoQuery.on('ready', () => {
      loadingSpinner.hide();
      if (searchResults.length === 0) {
        volunteersList.html(NoVolunteersError());
        if (noResults) {
          hideOnNextExit = true;
        }
      }
      noResults = true; // so that next query at first assumes no results
    });
};