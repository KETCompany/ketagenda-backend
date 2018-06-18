const { messaging } = require('firebase-admin');

const Logger = require('./logger');

const subscribe = (tokens, topic) => {
  if (tokens.length > 0) {
    return messaging().subscribeToTopic(tokens, `/topics/${topic}`)
      .then((response) => {
        Logger.info('Successfully subscribed to topic:', response);
      })
      .catch((error) => {
        Logger.error('Error subscribing to topic:', error);
      });
  }
  return Promise.resolve();
};

const send = message =>
  messaging().send(message)
    .then((response) => {
      Logger.info(`Successfully sent message: ${response}`);
    })
    .catch((error) => {
      Logger.error(`Error sending message: ${error}`);
    });

const sendToDevice = (token, title, body, variant = 'info') => {
  const message = {
    data: {
      title,
      message: body,
      variant,
    },
    token,
  };

  return send(message);
};

const sendToGroup = (topic, title, body, variant = 'info') => {
  const message = {
    data: {
      title,
      message: body,
      variant,
    },
    topic: `/topics/${topic}`,
  };

  return send(message);
};

module.exports = {
  sendToDevice,
  sendToGroup,
  subscribe,
};
