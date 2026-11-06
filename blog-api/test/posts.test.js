const request = require('supertest');
const app = require('../server');

describe('blog-api', () => {
  test('GET /posts returns a list', async () => {
    const res = await request(app).get('/posts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  test('GET /posts/:id returns the post or 404', async () => {
    const found = await request(app).get('/posts/1');
    expect(found.status).toBe(200);
    expect(found.body.id).toBe(1);

    const missing = await request(app).get('/posts/999');
    expect(missing.status).toBe(404);
  });

  test('POST /posts creates a post with a title', async () => {
    const res = await request(app).post('/posts').send({ title: 'New', body: 'Draft' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.title).toBe('New');
  });

  test('POST /posts without a title is rejected', async () => {
    const res = await request(app).post('/posts').send({ body: 'no title' });
    expect(res.status).toBe(400);
  });
});
