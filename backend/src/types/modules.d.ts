declare module 'swagger-jsdoc' {
  const swaggerJsdoc: (options: Record<string, unknown>) => Record<string, unknown>;
  export default swaggerJsdoc;
}

declare module 'swagger-ui-express' {
  import { Request, Response, NextFunction } from 'express';
  const serve: (req: Request, res: Response, next: NextFunction) => void;
  const setup: (spec: Record<string, unknown>, options?: Record<string, unknown>) => (req: Request, res: Response, next: NextFunction) => void;
  export { serve, setup };
}

declare module '@sentry/node' {
  export function init(options: Record<string, unknown>): void;
  export function captureException(error: Error, context?: Record<string, unknown>): string;
  export function captureMessage(message: string, level?: string): string;
  export const Integrations: {
    Http: new (options?: { tracing: boolean }) => unknown;
  };
}
