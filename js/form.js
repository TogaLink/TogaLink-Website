var config = {
  apiKey: "AIzaSyClTM0ddPhZgPoVtifd8TZ0c-LrC0iZshs",
  authDomain: "covid19saratoga.firebaseapp.com",
  databaseURL: "https://covid19saratoga.firebaseio.com",
  projectId: "covid19saratoga",
  storageBucket: "covid19saratoga.appspot.com",
  messagingSenderId: "1092626000161",
  appId: "1:1092626000161:web:86ad46738af11ef21cb660",
  measurementId: "G-ZFG19C7YDN"
};
var app = firebase.initializeApp(config);
var ref = firebase.database().ref("markers");
var submit = function () {
  var name = $("#name").val();
  var email = $("#email").val();
  var address = $("#address").val();
  var subject = $("#subject").val();
  var message = $("#message").val();

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

console.log("hello");

$("#formbutton").click(e => {
  e.preventDefault();
  console.log('IN SUBMIT');
  submit();
  location.reload();
});
