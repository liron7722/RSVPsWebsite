var express = require('express');
const logger = require('../models/logger')
var router = express.Router();

const childLogger = logger.child({ service: 'user pages' });

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  childLogger.trace('Someone load user page')
});

module.exports = router;
