[
  'PORT',
  // 'GOOGLE_CLIENT_ID',
  // 'GOOGLE_CLIENT_SECRET',
  // 'GOOGLE_CALLBACK_URL',
  'MONGO_HOST',
  'SOCKET_PORT',
].forEach((name) => {
  if (!process.env[name]) throw new Error(`Environment variable ${name} is missing`);
});

const config = {
  jwtSecret: process.env.JWT_SECRET,
  env: process.env.NODE_ENV,
  server: {
    port: Number(process.env.PORT),
    socketPort: Number(process.env.SOCKET_PORT),
  },
  passport: {
    google: {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
  },
  mongo: {
    host: process.env.MONGO_HOST,
  },
  firebase: {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_url: process.env.FIREBASE_AUTH_URI,
    token_url: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_urlg: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  },
};

module.exports = config;
