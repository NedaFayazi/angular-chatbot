import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import pinoHttp from 'pino-http';
import { logger } from './logger';
import { requireAuth } from './middleware/require-auth';
import { continueConversation } from './routes/continue-conversation';
import { getChatConversation } from './routes/get-chat-conversation';
import { getChatHistory } from './routes/get-chat-history';
import { getRoot } from './routes/root';
import { signIn } from './routes/sign-in';
import { signUp } from './routes/sign-up';
import { startConversation } from './routes/start-conversation';
import {initializeMockUsers} from './middleware/user-store';
import { googleAuth } from './routes/google-auth';

const DEFAULT_PORT = 9000;
const JSON_BODY_LIMIT = '100kb';
const CLIENT_ORIGIN = process.env['CLIENT_ORIGIN'];

const app = express();

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json({ limit: JSON_BODY_LIMIT }));

app.use(pinoHttp());
app.use(express.json());

app.get('/', getRoot);
app.post('/api/sign-in', signIn);
app.post('/api/sign-up', signUp);
app.get('/api/get-chat-history', requireAuth, getChatHistory);
app.get('/api/get-chat-conversation/:id', requireAuth, getChatConversation);
app.post('/api/start-conversation', requireAuth, startConversation);
app.post('/api/continue-conversation', requireAuth, continueConversation);
app.post('/api/auth/google', googleAuth);

const port = Number(process.env['PORT']) || DEFAULT_PORT;

async function startServer() {
  await initializeMockUsers();

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  logger.error({ err }, 'Failed to start the server');
  process.exit(1);
});

