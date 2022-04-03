/* eslint-disable no-undef */

const authJwt = require('../../subscribers/authJwt');

jest.spyOn(authJwt, 'isModerator').mockImplementation((req, res, next) => {
  if (!req.userId) {
    res.status(500).send({ message: 'err' });
    return;
  }
  if (req.userId !== 'mod') {
    res.status(403).send({ message: 'Require Moderator Role!' });
    return;
  }
  next();
});

jest.spyOn(authJwt, 'isAdmin').mockImplementation((req, res, next) => {
  if (!req.userId) {
    res.status(500).send({ message: 'err' });
    return;
  }
  if (req.userId !== 'admin') {
    res.status(403).send({ message: 'Require Admin Role!' });
    return;
  }
  next();
});
