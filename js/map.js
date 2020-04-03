let prevClickedMarker = null;

function initMap() {
  const mapOptions = {
    zoom: 11,
    center: new google.maps.LatLng(37.3875, -122.0575),
    mapTypeId: 'roadmap',
  };
  const map = new google.maps.Map(document.getElementById('map'), mapOptions);

  refMarkers.once('value', async function (snapshot) {
    if (!snapshot.exists()) {
      return;
    }
    const val = snapshot.val();
    console.log(val);
    const keys = Object.keys(val);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (k.startsWith('geo')) {
        continue;
      }
      let { address } = val[k];
      const titleFirebase = val[k].subject;
      console.log(address, k);
      while (address.indexOf(' ') != -1) {
        address = address.replace(' ', '+');
      }
      const position = await toCoords(address);
      const marker = new google.maps.Marker({
        position,
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
          $('.assistance-request-title').text(`${name} needs your assistance`);
          $('.assistance-request-subject').attr('value', subject);
          $('.assistance-request-message').text(message);

          DISQUS.reset({
            reload: true,
            config() {
              this.page.url = `https://covid19saratoga.com/#!/${markerRef}`;
              this.page.identifier = markerRef;
            },
          });
        }
        prevClickedMarker = marker;
        setTimeout(function () {
          location.hash = 'discussionContainer';
        }, 1000);
      });
      marker.addListener('dblclick', async function () {
        if (confirm('Are you sure you want to delete this marker?')) {
          console.log(k);
          console.log(refMarkers.child(k));
          await app.database().ref(`markers/${k}`).remove();
          await app.database().ref(`markers/geo${k}`).remove();
          if (marker === prevClickedMarker) {
            $('#discussion').hide();
            prevClickedMarker = null;
          }
          marker.setMap(null);
        }
      });
    }
  });

  refVolunteers.once('value', async function (snapshot) {
    if (!snapshot.exists()) {
      return;
    }
    const val = snapshot.val();
    console.log(val);
    const keys = Object.keys(val);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (k.startsWith('geo')) {
        continue;
      }
      let { address } = val[k];
      const titleFirebase = val[k].subject;
      console.log(address, k);
      while (address.indexOf(' ') != -1) {
        address = address.replace(' ', '+');
      }
      const position = await toCoords(address);
      const marker = new google.maps.Marker({
        position,
        map,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        },
      });
      marker.addListener('click', () => {
        const markerRef = k;
        const { name, email } = val[markerRef];
        const infowindow = new google.maps.InfoWindow({
          content: `Name: ${name}, Email: ${email}`,
        });
        infowindow.open(map, marker);
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
