import { z } from "zod";

export const bundleConfigSchema = z.object({});

export type BundleConfig = z.infer<typeof bundleConfigSchema>;