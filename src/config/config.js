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
  env: process.env.NODE_ENV,
  server: {
    port: Number(process.env.PORT),
    socketPort: Number(process.env.SOCKET_PORT),
  },
  password: {
    google: {
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
      googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
    },
  },
  mongo: {
    host: process.env.MONGO_HOST,
  },
};

module.exports = config;
