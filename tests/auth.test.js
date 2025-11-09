// tests/auth.test.js
const request = require('supertest');
const app = require('../src/server');

describe('Auth API', () => {
    it('should return 200 for base route', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
    });
});