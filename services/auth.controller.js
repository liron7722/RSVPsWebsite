/* eslint-disable no-param-reassign */
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const config = require('../config/auth.config');
const db = require('../models');
const logger = require('../scripts/logger');
const { validateSignIn, validateSignUp } = require('../scripts/validators');

const childLogger = logger.child({ service: 'auth controller' });
const User = db.user;
const Role = db.role;
const loginExpriation = 60 * 60 * 24; // 60 (sec) * 60 (min) * 24 (hours) = 24 hours
const errorLoginMessage = 'Invalid Username or Password';

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
const genRandomString = (length) => crypto.randomBytes(Math.ceil(length / 2))
  .toString('hex') /** convert to hexadecimal format */
  .slice(0, length); /** return required number of characters */

const saltRounds = genRandomString(40);

exports.signup = (req, res) => {
  if (!validateSignUp(req)) return;

  const userObj = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, saltRounds),
  });

  userObj.save((err, user) => {
    if (err) {
      res.status(500).send({ message: 'Server error' });
      childLogger.error(err);
      return;
    }

    if (req.body.roles) {
      Role.find(
        { name: { $in: req.body.roles } },
        (findErr, roles) => {
          if (findErr) {
            res.status(500).send({ message: 'Server error' });
            childLogger.error(findErr);
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((saveErr) => {
            if (saveErr) {
              res.status(500).send({ message: 'Server error' });
              childLogger.error(saveErr);
              return;
            }

            res.send({ message: 'User was registered successfully!' });
          });
        },
      );
    } else {
      Role.findOne({ name: 'user' }, (findErr, role) => {
        if (findErr) {
          res.status(500).send({ message: 'Server error' });
          childLogger.error(findErr);
          return;
        }

        user.roles = [role._id];
        user.save((saveErr) => {
          if (saveErr) {
            res.status(500).send({ message: 'Server error' });
            childLogger.error(saveErr);
            return;
          }

          res.send({ message: 'User was registered successfully!' });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  if (!validateSignIn(req)) return;

  User.findOne({
    $or: [{ username: req.body.username }, { email: req.body.username }],
  })
    .populate('roles', '-__v')
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: 'Server error' });
        childLogger.error(err);
        return;
      }

      if (!user) {
        res.status(401).send({ accessToken: null, message: errorLoginMessage });
        return;
      }

      const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

      if (!passwordIsValid) {
        res.status(401).send({ accessToken: null, message: errorLoginMessage });
        return;
      }

      const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: loginExpriation });

      const authorities = [];

      user.roles.forEach((role) => {
        authorities.push(`ROLE_${role.name.toUpperCase()}`);
      });

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
      });
    });
};
