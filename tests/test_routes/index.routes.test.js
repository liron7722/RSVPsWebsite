/* global describe, it, expect */

require('../__mocks__/logger');
require('../__mocks__/db_model');
require('../__mocks__/mongodb_init');
const supertest = require('supertest');
const app = require('../../app');

const request = supertest(app);

describe('tests endpoints', () => {
  it('should return a response from /', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
  });

  it('should return a response from /isAlive', async () => {
    const response = await request.get('/isAlive');
    expect(response.status).toBe(200);
    expect(response.text).toBe('OK');
  });
});
