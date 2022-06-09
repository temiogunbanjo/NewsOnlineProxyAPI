const express = require('express');

const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const indexRouter = require('./api/routes/index');

const ErrorHandler = require('./ErrorHelpers/ErrorHandler');
const { sendErrorResponse } = require('./utils/sendResponses');
const HttpStatusCode = require('./ErrorHelpers/Statuscode');

// logs with wiston
const wiston = require('./ErrorHelpers/WistonLogger');

const app = express();
// add stream option to morgan
app.use(morgan('combined', { stream: wiston.stream }));
app.use(express.json({
  limit: '50mb',
}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CORS allow middleware
app.options('*', cors());
app.use(cors());

app.use('/static', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/api/v1', indexRouter);

// catch 404 and forward to error handler
app.all('/*', (req, res) => {
  wiston.error(
    `404 -${res.message || 'Route not found'} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  );
  res.status(404).send({
    status: 'error',
    error: 'This route is unavailable on this server',
  });
});

// get the unhandled rejection and throw it to another fallback handler we already have.
// eslint-disable-next-line no-unused-vars
process.on('unhandledRejection', (error, _promise) => {
  throw error;
});

// handle any uncaught exceptions
process.on('uncaughtException', (error) => {
  ErrorHandler.handleError(error);
  if (!ErrorHandler.isTrustedError(error)) {
    process.exit(1);
  }
});

// error handler
app.use(async (err, req, res, next) => {
  console.log({ app: err });
  if (err instanceof Error) {
    wiston.error(
      `${err.status || HttpStatusCode.INTERNAL_SERVER} - ${err.message} - ${
        req.originalUrl
      } - ${req.method} - ${req.ip}`
    );

    if (ErrorHandler.isTrustedError(err)) {
      await ErrorHandler.handleError(err, res);
    } else if (err.isAxiosError && err.response) {
      return sendErrorResponse(
        res,
        err.response.status || HttpStatusCode.INTERNAL_SERVER,
        `[Axios]: ${err.message}`
      );
    } else {
      // what do we do when error is not operational
      let responseMessage = '';
      const isTimedOut = err.message
        && (err.message.toLowerCase().includes('timedout')
        || err.message.toLowerCase().includes('timeout'));

      const isNotNullError = err.message && err.message.toLowerCase().includes('not-null');

      switch (true) {
        case isTimedOut:
          err.status = HttpStatusCode.REQUEST_TIMEOUT;
          responseMessage = 'Request timeout! Try again';
          break;

        case isNotNullError:
          err.status = HttpStatusCode.BAD_REQUEST;
          responseMessage = 'Incomplete parameters or a non null value was expected!';
          break;

        default:
          responseMessage = 'An error just occured, please try again';
          break;
      }
      sendErrorResponse(
        res,
        err.status || HttpStatusCode.INTERNAL_SERVER,
        responseMessage
      );
    }
  } else {
    next(err);
  }
});

module.exports = app;
