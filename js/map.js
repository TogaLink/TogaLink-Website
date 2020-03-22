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

  var addresses = [];
  addresses.push("14800 Andrew Ct, Saratoga, CA 95070");
  for (var i = 0; i < addresses.length; i++) {
    var ad = addresses[i];
    console.log(ad);
    while (ad.indexOf(" ") != -1) {
      ad = ad.replace(" ", "+");
    }
    axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: ad,
        key: 'AIzaSyCUmA1jvhKOYygqrQMVJi8IJmXuW496HGk'
      }
    }).then(function(response) {
      const marker = new google.maps.Marker({
        position: response.data.results[0].geometry.location,
        map,
        icon: {                             
          url: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngkit.com%2Fbigpic%2Fu2q8i1q8w7y3y3a9%2F&psig=AOvVaw0W2BpMmLSXGeweaJy2-pRh&ust=1584989490594000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCOi-mYjgrugCFQAAAAAdAAAAABAD"                          
        }
      });
    });
  }

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
        const markerRef = k;
        if (marker === prevClickedMarker) {
          $('#discussion').toggle('slow');
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
          await secondApp.database().ref(`markers/${k}`).remove();
          if (marker === prevClickedMarker) {
            $('#discussion').hide();
            prevClickedMarker = null;
          }
          marker.setMap(null);
        }
      });
    }
  });
}
