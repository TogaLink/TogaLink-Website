// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

let config = require('./env.json');
if (Object.keys(functions.config()).length) {
  config = functions.config();
}

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.sendgrid.key);

exports.onMarkerCreate = functions.database.ref('/markers/{postId}').onCreate((snapshot, _) => {
  const { name, email, address, subject, message } = snapshot.val();
  const msg = {
    to: 'togalink2020@gmail.com',
    from: 'info@togalink.org',
    replyTo: email,
    subject: `[TogaLink] COVIDcare: ${name} needs your help!`,
    html: removeSpacesBetweenNewlineAndText(`
    ${name} (${email}) has placed a marker at ${address}.\n\n

    <strong>Subject</strong>: ${subject}\n
    <strong>Message</strong>: ${message}`),
  };
  return sgMail.send(msg);
});

const removeSpacesBetweenNewlineAndText = string => string.replace(/(?<=^|\n) +/g, '');
