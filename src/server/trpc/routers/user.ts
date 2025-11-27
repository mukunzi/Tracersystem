import { z } from 'zod';
import { publicProcedure, router } from '../../trpc';

export const userRouter = router({
  getAll: publicProcedure.query(() => {
    // Example: return mock data (replace with DB call)
    return [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
    ];
  }),

  getById: publicProcedure
    .input(z.string())
    .query(({ input }) => {
      // Fetch user by ID
      return { id: input, name: `User ${input}` };
    }),
});
