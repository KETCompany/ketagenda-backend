// FIREBASE
const admin = require('firebase-admin');
const config = require('./config');

const serviceAccount = config.firebase;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ketagenda-96c0d.firebaseio.com',
});
