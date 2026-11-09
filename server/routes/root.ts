import { Request, Response } from 'express';

import { logger } from '../logger';

const confirmationPage = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Angular AI In Depth — Server</title>
    <style>
      body {
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        display: grid;
        place-items: center;
        min-height: 100vh;
        margin: 0;
        background: #0f172a;
        color: #e2e8f0;
      }
      main {
        text-align: center;
        padding: 2rem 3rem;
        border: 1px solid #1e293b;
        border-radius: 12px;
        background: #111827;
      }
      h1 { margin: 0 0 0.5rem; font-size: 1.5rem; }
      p { margin: 0; color: #94a3b8; }
      .dot { color: #22c55e; }
    </style>
  </head>
  <body>
    <main>
      <h1><span class="dot">●</span> Server is up and running</h1>
      <p>Angular AI In Depth backend — OpenAI chatbot API</p>
    </main>
  </body>
</html>
`;

export function getRoot(request: Request, response: Response) {
  logger.debug({ path: request.path }, 'Serving server running confirmation page');
  response.type('html').send(confirmationPage);
}
