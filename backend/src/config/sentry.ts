import * as Sentry from '@sentry/node';
import { config } from './index';

export const initSentry = () => {
  if (config.sentry?.dsn) {
    Sentry.init({
      dsn: config.sentry.dsn,
      environment: config.env,
      tracesSampleRate: config.sentry?.tracesSampleRate || 0.1,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true })
      ],
    });
  }
};

export const captureError = (error: Error, context?: Record<string, unknown>) => {
  Sentry.captureException(error, { extra: context });
};

export const captureMessage = (message: string, level = 'info') => {
  Sentry.captureMessage(message, level);
};
