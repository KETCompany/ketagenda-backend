const { messaging } = require('firebase-admin');

const Logger = require('./logger');

const subscribe = (tokens, topic) =>
  messaging().subscribeToTopic(tokens, `/topics/${topic}`)
    .then((response) => {
      // See the MessagingTopicManagementResponse reference documentation
      // for the contents of response.
      console.log('Successfully subscribed to topic:', response);
    })
    .catch((error) => {
      console.log('Error subscribing to topic:', error);
    });

const send = message =>
  messaging().send(message)
    .then((response) => {
      Logger.info(`Successfully sent message: ${response}`);
    })
    .catch((error) => {
      Logger.error(`Error sending message: ${error}`);
    });

const sendToDevice = (token, title, body) => {
  const message = {
    data: {
      title,
      message: body,
    },
    token,
  };

  return send(message);
};

const sendToGroup = (topic, title, body) => {
  const message = {
    data: {
      title,
      message: body,
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
