import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import cors from 'cors';
import { appRouter } from './trpc/router';

const app = express();
app.use(cors());

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  })
);

app.listen(3000, () => {
  console.log('tRPC server listening on port 3000');
});

export type AppRouter = typeof appRouter;
