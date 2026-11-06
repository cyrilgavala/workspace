# blog-api — simple in-memory REST API for a blog

Express + Jest exercise. In-memory post store with three endpoints.

## Endpoints
- `GET /posts` — list all posts.
- `GET /posts/:id` — one post, or `404` if missing.
- `POST /posts` — create a post (`title` required, `400` if absent); returns `201` + the new post.

## Verify
```bash
cd blog-api
npm install
npm test
```

Run the server: `npm start` (listens on `:3000`, override with `PORT`).
