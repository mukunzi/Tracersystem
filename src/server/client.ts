// src/trpc/client.ts   ←  tRPC v11 version (2024–2025)
import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server';   // ← adjust path if needed

// Create the React proxy
export const trpc = createTRPCReact<AppRouter>();

// Create the actual client instance
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});