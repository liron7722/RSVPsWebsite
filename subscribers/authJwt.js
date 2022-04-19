/* eslint-disable no-plusplus */
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models');

const User = db.user;
const Role = db.role;

const findUserError = 'Find user error';

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }
    req.userId = decoded.id;
    next();
    return undefined;
  });
  return undefined;
};

const isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: findUserError });
      // todo: log error
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (findRoleErr, roles) => {
        if (findRoleErr) {
          res.status(500).send({ message: findUserError });
          // todo: log error
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'admin') {
            next();
            return;
          }
        }

        res.status(403).send({ message: 'Require Admin Role!' });
      },
    );
  });
};

const isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: findUserError });
      // todo: log error
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (findRoleErr, roles) => {
        if (findRoleErr) {
          res.status(500).send({ message: findUserError });
          // todo: log error
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'moderator') {
            next();
            return;
          }
        }

        res.status(403).send({ message: 'Require Moderator Role!' });
      },
    );
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
};
module.exports = authJwt;
