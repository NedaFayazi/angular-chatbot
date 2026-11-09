
## Backend code rules

- the backend uses Node and Express, and runs on localhost:9000.

- to start the backend the user should run npm run server

- there is no persistent database, just in-memory modifiable mock data based on a db-data.ts file

- each Express route should be in a separate file under the /server/routes folder. Make the routes plain express functions, and link them to the url and the HTTP method on server.ts

- make the backend secure according to the latest OWASP recommendations.

- load environment variables from an environment file .env using the dotenv package

- use the package pino for logging. Added appropriate logging to all code.

- don't use the OpenAI SDK Node wrapper to interact with their API. Instead, build plain HTTP requests directly.

- authentication is based on email and password only, with Argon2id hashed/salted passwords (OWASP recommended).
  The implementation should be fully functional and usable, even though there is no database storage.
  POST /api/sign-in (authenticate) and POST /api/sign-up (register + add to the in-memory store) both return the
  user profile plus a signed HS256 JWT (secret from the JWT_SECRET env var); shared response type in model/auth-response.ts.
  The requireAuth middleware (server/middleware/require-auth.ts) verifies the Bearer JWT and attaches request.user.
  It is exported and ready to use, but not yet wired onto any route (routes are unguarded until the frontend sends the token).
