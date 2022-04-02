/* eslint-disable no-undef */

const db = jest.mock('../../models', () => {
  const mongoose = {
    connect: jest.fn(),
  };
  const User = {
    findById: jest.fn(() => {

    }),
  };
  return {
    mongoose: jest.fn(() => mongoose),
    user: jest.fn(() => User),
  };
});

module.exports = db;
