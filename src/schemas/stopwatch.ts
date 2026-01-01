import { z } from 'zod';

export const stopwatchSchema = z
  .object({
    time: z.number().default(0), // ミリ秒
    isRunning: z.boolean().default(false),
  })
  .default({ time: 0, isRunning: false });

export type Stopwatch = z.infer<typeof stopwatchSchema>;
