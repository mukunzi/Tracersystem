import { router } from '../trpc';
import { userRouter } from './routers/user';

export const appRouter = router({
  user: userRouter,
});

// This is the type used in the frontend
export type AppRouter = typeof appRouter;
