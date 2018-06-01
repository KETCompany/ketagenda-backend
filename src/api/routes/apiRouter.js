const express = require('express');
const roomRouter = require('./room.route');
const groupRouter = require('./group.route');
const userRouter = require('./user.route');
const eventRouter = require('./event.route');

const apiRouter = express.Router();

apiRouter.use('/rooms', roomRouter);
apiRouter.use('/groups', groupRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/events', eventRouter);


module.exports = apiRouter;
