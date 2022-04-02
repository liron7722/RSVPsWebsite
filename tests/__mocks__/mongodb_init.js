/* eslint-disable no-undef */

const mongoInit = jest.mock('../../scripts/mongodb_init', () => ({
  initial: jest.fn(),
}));

module.exports = mongoInit;
