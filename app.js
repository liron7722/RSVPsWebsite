const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morganLogger = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const cors = require('cors');
const logger = require('./scripts/logger');
require('./scripts/mongodb_init');

const indexRouter = require('./routes/index.routes');
const usersRouter = require('./routes/users.routes');
const authsRouter = require('./routes/auth.routes');

const csrfProtection = csrf({ cookie: true });
const childLogger = logger.child({ service: 'app' });
// deepcode ignore DisablePoweredBy: disable later in the code
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(morganLogger('dev'));
app.use(limiter); // Apply the rate limiting middleware to all requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());
app.use(cors({ origin: 'http://localhost:8081' }));
app.use(csrfProtection);

app.use((req, res, next) => {
  res.removeHeader('X-Powered-By');
  next();
});

app.use('/', indexRouter);
app.use('/users', [usersRouter, authsRouter]);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');

  childLogger.error(err);
});

module.exports = app;
