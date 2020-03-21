var firebaseConfig = {
  apiKey: "AIzaSyClTM0ddPhZgPoVtifd8TZ0c-LrC0iZshs",
  authDomain: "covid19saratoga.firebaseapp.com",
  databaseURL: "https://covid19saratoga.firebaseio.com",
  projectId: "covid19saratoga",
  storageBucket: "covid19saratoga.appspot.com",
  messagingSenderId: "1092626000161",
  appId: "1:1092626000161:web:86ad46738af11ef21cb660",
  measurementId: "G-ZFG19C7YDN"
};
var secondApp = firebase.initializeApp(firebaseConfig, "Second");
var ref = secondApp.database().ref("markers");

let prevClickedMarker = null;

function initMap() {
  var mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(37.270905, -122.021607),
    mapTypeId: 'roadmap'
  };
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);

  var markers = [];

  ref.on("value", function (snapshot) {
    var val = snapshot.val();
    console.log(val);
    var keys = Object.keys(val);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var address = val[k].address;
      var titleFirebase = val[k].subject;
      console.log(address, k);
      while (address.indexOf(" ") != -1) {
        address = address.replace(" ", "+");
      }
      axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address,
          key: 'AIzaSyCUmA1jvhKOYygqrQMVJi8IJmXuW496HGk'
        }
      })
        .then(function (response) {
          var marker = new google.maps.Marker({
            position: response.data.results[0].geometry.location,
            map,
          });
          marker.addListener('click', () => {
            const markerRef = k;
            if (marker === prevClickedMarker) {
              $('#discussion').toggle('slow');
            } else {
              const name = val[markerRef].name;
              $('.assistance-request-title')
                .text(`${name} needs your assistance`);
            }
            prevClickedMarker = marker;
          })
          marker.addListener('dblclick', function () {
            const markerRef = k;
            if (confirm("Are you sure you want to delete this marker?")) {
              console.log(markerRef);
              console.log(ref.child(markerRef)); // TODO: Fix this: since Firebase is asynchronous, this always 
                                         // removes the LAST marker, not the one that is clicked.
              ref.child(markerRef).remove();
              marker.setMap(null);
              // marker = null; // unnecessary
            }
          });
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  });
}
