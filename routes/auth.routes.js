const express = require('express');
const { verifySignUp } = require('../subscribers');
const controller = require('../services/auth.controller');

const router = express.Router();

router.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept',
  );

  next();
});

router.post(
  '/api/auth/signup',
  [
    verifySignUp.checkDuplicateUsernameOrEmail,
    verifySignUp.checkRolesExisted,
  ],
  controller.signup,
);

router.post('/api/auth/signin', controller.signin);

module.exports = router;
