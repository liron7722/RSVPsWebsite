/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const logger = require('../../scripts/logger');

jest.spyOn(logger, 'child').mockImplementation(() => {
  const debug = jest.fn();
  const info = jest.fn();
  const error = jest.fn();
});
