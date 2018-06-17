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
};

module.exports = config;
