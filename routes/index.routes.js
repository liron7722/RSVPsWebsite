const express = require('express');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const rateLimitMs = 1 * 60 * 1000; // 1 minute duration in milliseconds
const max = 50;
const rateLimitMessage = 'You exceeded the amount of requests!';
const allowedHeaders = true;

router.use((req, res, next) => {
  res.removeHeader('X-Powered-By');
  next();
});

router.use(
  rateLimit({
    windowMs: rateLimitMs,
    max,
    message: rateLimitMessage,
    headers: allowedHeaders,
  }),
);

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
  next();
});

/* GET isAlive. */
router.get('/isAlive', (req, res, next) => {
  res.sendStatus(200);
  next();
});

module.exports = router;
