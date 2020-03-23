var ref = firebase.database().ref("markers");
var ref2 = firebase.database().ref("volunteers");
var submit = function (section) {
  var name = $(`${section} #name`).val();
  var email = $(`${section} #email`).val();
  var address = $(`${section} #address`).val();
  var subject = $(`${section} #subject`).val();
  var message = $(`${section} #message`).val();

  ref.push({
    "name": name,
    "email": email,
    "address": address,
    "subject": subject,
    "message": message
  }).then(function (ref) {
    console.log(ref.parent + "/" + ref.key);
  })
  .catch(function (error) {
    console.log(error);
  })
};

var submit2 = function (section) {
  var name = $(`${section} #name2`).val();
  var email = $(`${section} #email2`).val();
  var address = $(`${section} #address2`).val();
  var phone = $(`${section} #phone`).val();

  ref2.push({
    "name": name,
    "email": email,
    "address": address,
    "phone": phone,
  }).then(function (ref) {
    console.log(ref.parent + "/" + ref.key);
  })
  .catch(function (error) {
    console.log(error);
  })
};

var search = function (section) {
  // TODO: Finish
  // Add new section with loaded results ordered by distance and go to that section
};


$("#formbutton").click(e => {
  e.preventDefault();
  console.log('IN SUBMIT');
  submit('#input');
  location.reload();
});

$("#formbutton2").click(e => {
  e.preventDefault();
  console.log('IN SUBMIT');
  submit2('#input2');
  location.reload();
});

$("#searchbutton").click(e => {
  e.preventDefault();
  console.log('IN SUBMIT');
  search('#map2');
});
