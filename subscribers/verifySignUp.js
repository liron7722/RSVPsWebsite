/* eslint-disable no-plusplus */
const db = require('../models');
const logger = require('../scripts/logger');

const { ROLES } = db;
const User = db.user;
const childLogger = logger.child({ service: 'user pages' });

const checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    username: req.body.username,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: 'server error - username' });
      childLogger.error(err);
      return;
    }

    if (user) {
      res.status(400).send({ message: 'Failed! Username is already in use!' });
      return;
    }

    // Email
    User.findOne({
      email: req.body.email,
    }).exec((findEmailErr, email) => {
      if (findEmailErr) {
        res.status(500).send({ message: 'server error - email' });
        childLogger.error(findEmailErr);
        return;
      }

      if (email) {
        res.status(400).send({ message: 'Failed! Email is already in use!' });
        return;
      }

      next();
    });
  });
};

const checkRolesExisted = (req, res, next) => {
  const { roles } = req.body;
  if (Array.isArray(roles)) {
    if (roles.length > 10) {
      res.status(400).send({ message: 'Failed! Too many roles!' });
      return;
    }

    for (let i = 0; i < roles.length; i++) {
      if (!ROLES.includes(roles[i])) {
        res.status(400).send({ message: `Failed! Role ${roles[i]} does not exist!` });
        return;
      }
    }
  }

  next();
};

module.exports = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};
