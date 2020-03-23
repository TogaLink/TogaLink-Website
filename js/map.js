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
var app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();
var ref = app.database().ref("markers");
var ref2 = app.database().ref("volunteers");

let prevClickedMarker = null;

function initMap() {
  var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(37.270905, -122.021607),
    mapTypeId: 'roadmap'
  };
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);

  ref.once("value", async function (snapshot) {
    if (!snapshot.exists()) {
      return;
    }
    var val = snapshot.val();
    console.log(val);
    var keys = Object.keys(val);
    for (var i = 0; i < keys.length; i++) {
      const k = keys[i];
      var address = val[k].address;
      var titleFirebase = val[k].subject;
      console.log(address, k);
      while (address.indexOf(" ") != -1) {
        address = address.replace(" ", "+");
      }
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address,
          key: 'AIzaSyCUmA1jvhKOYygqrQMVJi8IJmXuW496HGk'
        }
      })
      const marker = new google.maps.Marker({
        position: response.data.results[0].geometry.location,
        map,
      });
      marker.addListener('click', () => {
        // TODO: Make all blue markers within a half-mile radius twice as large
        const markerRef = k;
        if (marker === prevClickedMarker) {
          $('#discussion').toggle('slow');
          // TODO: Make all blue markers normal size again
        } else {
          $('#discussion').show();
          const { name, subject, message } = val[markerRef];
          $('.assistance-request-title')
            .text(`${name} needs your assistance`);
          $('.assistance-request-subject')
            .attr("value", subject);
          $('.assistance-request-message')
            .text(message);

          DISQUS.reset({
            reload: true,
            config: function() {
              this.page.url = `https://covid19saratoga.com/#!/${markerRef}`;
              this.page.identifier = markerRef;
            }
          });
        };
        prevClickedMarker = marker;
        setTimeout(function() {
          location.hash = "discussionContainer";
        }, 1000);
      });
      marker.addListener('dblclick', async function () {
        if (confirm("Are you sure you want to delete this marker?")) {
          console.log(k);
          console.log(ref.child(k));
          await app.database().ref(`markers/${k}`).remove();
          if (marker === prevClickedMarker) {
            $('#discussion').hide();
            prevClickedMarker = null;
          }
          marker.setMap(null);
        }
      });
    }
  });

  ref2.once("value", async function (snapshot) {
    if (!snapshot.exists()) {
      return;
    }
    var val = snapshot.val();
    console.log(val);
    var keys = Object.keys(val);
    for (var i = 0; i < keys.length; i++) {
      const k = keys[i];
      var address = val[k].address;
      var titleFirebase = val[k].subject;
      console.log(address, k);
      while (address.indexOf(" ") != -1) {
        address = address.replace(" ", "+");
      }
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address,
          key: 'AIzaSyCUmA1jvhKOYygqrQMVJi8IJmXuW496HGk'
        }
      })
      const marker = new google.maps.Marker({
        position: response.data.results[0].geometry.location,
        map,
        icon: {                             
          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"                          
        }
      });
      marker.addListener('click', () => {
        const markerRef = k;
        const { name, email, phone } = val[markerRef];
        var infowindow = new google.maps.InfoWindow({
          content: "Name: " + name+", Email: " + email + ", Phone #: " + phone,
        });
        infowindow.open(map,marker);
      });
      // marker.addListener('dblclick', async function () {
      //   if (confirm("Are you sure you want to delete this marker?")) {
      //     console.log(k);
      //     console.log(ref.child(k));
      //     await app.database().ref(`volunteers/${k}`).remove();
      //     marker.setMap(null);
      //   }
      // });
    }
  });
}
