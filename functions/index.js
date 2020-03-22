// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const onMarkerCreate = functions.database.ref('/posts/{postId}').onCreate((snapshot, _) => {
  const { name, email, address, subject, message } = snapshot.val();
  const msg = {
    to: 'togalink2020@gmail.com',
    from: 'info@togalink.org',
    replyTo: email,
    subject: `[TogaLink] COVIDcare: ${name} needs your help!`,
    text: `${name} (${email}) has placed a marker at ${address}.

    <strong>Subject</strong>: ${subject}
    <strong>Message</strong>: ${message}`,
    html: '<strong>and easy to do anywhere, even with Node.js</strong>'.replace(/\b\t\b/g, ''),
  };
  return sgMail.send(msg);
})

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
