import express, { Application, Request, Response } from 'express';
import { setupRoutes } from './routes';

const app: Application = express();

setupRoutes(app);

if (process.env.NODE_ENV !== 'production') {
  import('./config/swagger').then(({ swaggerSpec, swaggerUi }) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'TechNova API Documentation',
    }));
  }).catch(() => {
    // Swagger packages not installed; docs route skipped
  });
}

app.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'TechNova Mobile Store API',
    version: '1.0.0',
    endpoints: {
      health: '/api/v1/health',
      auth: '/api/v1/auth',
      products: '/api/v1/products',
      orders: '/api/v1/orders',
      users: '/api/v1/users',
      categories: '/api/v1/categories',
      brands: '/api/v1/brands',
      reviews: '/api/v1/reviews',
      messages: '/api/v1/messages',
      upload: '/api/v1/upload',
      analytics: '/api/v1/analytics'
    }
  });
});

export default app;
