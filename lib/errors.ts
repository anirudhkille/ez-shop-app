/** Errors arrive as `unknown`, so only real Error instances can explain themselves. */
export const errorMessage = (error: unknown, fallback: string) =>
  error instanceof Error && error.message ? error.message : fallback;
