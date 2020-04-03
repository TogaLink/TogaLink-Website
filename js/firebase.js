const firebaseConfig = {
  apiKey: 'AIzaSyClTM0ddPhZgPoVtifd8TZ0c-LrC0iZshs',
  authDomain: 'covid19saratoga.firebaseapp.com',
  databaseURL: 'https://covid19saratoga.firebaseio.com',
  projectId: 'covid19saratoga',
  storageBucket: 'covid19saratoga.appspot.com',
  messagingSenderId: '1092626000161',
  appId: '1:1092626000161:web:86ad46738af11ef21cb660',
  measurementId: 'G-ZFG19C7YDN',
};
const app = firebase.initializeApp(firebaseConfig);
const db = app.database();
const perf = firebase.performance();
const analytics = firebase.analytics();
const refMarkers = db.ref('markers');
const refVolunteers = db.ref('volunteers');
