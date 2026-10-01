const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const app = require('../src/app');

describe('Node.js Web App API Tests', () => {
  let server;
  let baseUrl;

  before(async () => {
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise((resolve) => {
      server.close(resolve);
    });
  });

  test('GET / should return 200 and welcome message', async () => {
    const response = await fetch(`${baseUrl}/`);
    assert.strictEqual(response.status, 200);

    const data = await response.json();
    assert.strictEqual(data.status, 'success');
    assert.ok(data.message.includes('Elevate Labs DevOps Internship'));
    assert.strictEqual(data.version, '1.0.0');
  });

  test('GET /health should return status healthy and 200', async () => {
    const response = await fetch(`${baseUrl}/health`);
    assert.strictEqual(response.status, 200);

    const data = await response.json();
    assert.strictEqual(data.status, 'healthy');
    assert.ok(typeof data.uptime === 'number');
  });
});
