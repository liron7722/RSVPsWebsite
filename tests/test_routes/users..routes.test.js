/* global describe, it, expect */

require('dotenv').config();
require('../__mocks__/logger');
require('../__mocks__/authJwt');
require('../__mocks__/db_model');
require('../__mocks__/mongodb_init');
const jwt = require('jsonwebtoken');
const supertest = require('supertest');
const config = require('../../config/auth.config');
const app = require('../../app');

const request = supertest(app);

const userEndpoint = '/users/api/test/user';
const modEndpoint = '/users/api/test/mod';
const adminEndpoint = '/users/api/test/admin';

const userToken = jwt.sign({ id: 'user' }, config.secret);
const modToken = jwt.sign({ id: 'mod' }, config.secret);
const adminToken = jwt.sign({ id: 'admin' }, config.secret);

const invalidToken = jwt.sign({ id: 'user' }, config.generateSecret(10));

const requireModMessage = 'Require Moderator Role!';
const requireAdminMessage = 'Require Admin Role!';

const testableEndpoints = [
  { endpoint: userEndpoint, token: userToken },
  { endpoint: modEndpoint, token: modToken, requireMessage: requireModMessage },
  { endpoint: adminEndpoint, token: adminToken, requireMessage: requireAdminMessage },
];

describe('tests endpoints', () => {
  // all users
  it('should return a response from /users/api/test/all', async () => {
    const response = await request.get('/users/api/test/all');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Public Content.');
  });

  testableEndpoints.forEach(({ endpoint, token, requireMessage }) => {
    it(`should return a 200 with headers from ${endpoint}`, async () => {
      const response = await (await request.get(endpoint).set({ 'x-access-token': token }));
      expect(response.status).toBe(200);
    });

    it(`should return a 401 with invaild token from ${endpoint}`, async () => {
      const response = await request.get(endpoint).set({ 'x-access-token': invalidToken });
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized!');
    });

    if (endpoint !== userEndpoint) {
      it(`should return a 403 with wrong rule from ${endpoint}`, async () => {
        const response = await request.get(endpoint).set({ 'x-access-token': userToken });
        expect(response.status).toBe(403);
        expect(response.body.message).toBe(requireMessage);
      });
    }

    it(`should return a 403 w/o headers from ${endpoint}`, async () => {
      const response = await request.get(endpoint);
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('No token provided!');
    });
  });
});
