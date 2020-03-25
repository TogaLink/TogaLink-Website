const addToFirebase = async (ref, obj) => {
  const { address } = obj;
  const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params: {
      address,
      key: 'AIzaSyCUmA1jvhKOYygqrQMVJi8IJmXuW496HGk'
    }
  });
  const { lat, lng } = response.data.results[0].geometry.location;
  const key = ref.push().key;
  const geoFire = new geofire.GeoFire(ref)
  await geoFire.set(`geo${key}`, [lat, lng]);

  ref.child(key).set(obj);
}

var submit = async function (section) {
  var name = $(`${section} #name`).val();
  var email = $(`${section} #email`).val();
  var address = $(`${section} #address`).val();
  var subject = $(`${section} #subject`).val();
  var message = $(`${section} #message`).val();

  await addToFirebase(refMarkers, { name, email, address, subject, message });
};

var submit2 = async function (section) {
  var name = $(`${section} #name2`).val();
  var email = $(`${section} #email2`).val();
  var address = $(`${section} #address2`).val();
  var phone = $(`${section} #phone`).val();
  
  await addToFirebase(refVolunteers, { name, email, address, phone });
};

var search = function (section) {
  // TODO: Finish
  // Add new section with loaded results ordered by distance and go to that section
};


$("#formbutton").click(async e => {
  e.preventDefault();
  console.log('IN SUBMIT');
  await submit('#input');
  location.reload();
});

$("#formbutton2").click(async e => {
  e.preventDefault();
  console.log('IN SUBMIT');
  await submit2('#input2');
  location.reload();
});

$("#searchbutton").click(e => {
  e.preventDefault();
  console.log('IN SUBMIT');
  search('#map2');
});
