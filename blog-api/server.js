const express = require('express');

const app = express();
app.use(express.json());

// In-memory store.
const posts = [
  { id: 1, title: 'First post', body: 'Hello world' },
  { id: 2, title: 'Second post', body: 'Another post' },
];
let nextId = 3;

// GET /posts — list all posts.
app.get('/posts', (req, res) => {
  res.json(posts);
});

// GET /posts/:id — one post, or 404 if missing.
app.get('/posts/:id', (req, res) => {
  const post = posts.find((p) => p.id === Number(req.params.id));
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

// POST /posts — create a post (title required), returns 201 + the new post.
app.post('/posts', (req, res) => {
  const { title, body } = req.body || {};
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }
  const post = { id: nextId++, title: title.trim(), body: body || '' };
  posts.push(post);
  res.status(201).json(post);
});

// Only listen when run directly, so tests can import the app.
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`blog-api listening on :${port}`));
}

module.exports = app;
