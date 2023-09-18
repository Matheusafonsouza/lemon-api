const request = require('supertest')
const app = require('../../src/config/express')

describe('ClientService', () => {
  it('Should return status', async () => {
    await request(app).get('/status')
      .expect(200)
      .expect({ status: 'OK'})
  });
});
