// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

admin.initializeApp();

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');

let config = require('./env.json');

if (Object.keys(functions.config()).length) {
  config = functions.config();
}

sgMail.setApiKey(config.sendgrid.key);

exports.onMarkerCreate = functions.database
  .ref('/markers/{postId}')
  .onCreate((snapshot, _) => {
    const { name, email, address, subject, message } = snapshot.val();

    // TODO: automatically bail if the new doc id starts with 'geo'

    // return null if any fields are falsy
    if (!name && !email && !address && !subject && !message) {
      return null;
    }

    const msg = {
      to: 'team@togalink.org', // TODO: change to campaign@rishi2020.com
      from: 'info@togalink.org',
      replyTo: email,
      subject: `[TogaLink] ${name} needs your help!`,
      text: 'Please view in html',
      html: `${name} (${email}) has placed a marker at ${address}.
            <br><br>
            <strong>Subject</strong>: ${subject}
            <br>
            <strong>Message</strong>: ${message}`,
    };
    return sgMail.send(msg);
  });
