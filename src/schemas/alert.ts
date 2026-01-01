import { z } from 'zod';

export const alertSchema = z.string().default('Hello from NodeCG!');

export type Alert = z.infer<typeof alertSchema>;
