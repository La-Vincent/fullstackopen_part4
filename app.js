const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const blogRouter = require('./controllers/blog');
const userRouter = require('./controllers/user');
const loginRouter = require('./controllers/login');
const logger = require('./utils/logger');
const config = require('./utils/config');
const middleware = require('./utils/middleware');
const app = express();

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())

app.use('/api/login', loginRouter);
app.use('/api/users', userRouter);
app.use('/api/blogs', blogRouter);

// app.use(logger.error);
app.use(middleware.exceptionHandler);

module.exports = app;

