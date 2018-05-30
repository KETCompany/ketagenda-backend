const express = require('express');
const roomRouter = require('./room.route');

const apiRouter = express.Router();

apiRouter.use('/rooms', roomRouter);

module.exports = apiRouter;
