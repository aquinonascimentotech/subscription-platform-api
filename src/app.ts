import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { config } from './config';
import { errorHandler } from './utils/errors';
import { authenticate, requireAdmin } from './middlewares/auth';

// Routes
import { authRoutes } from './routes/auth.routes';
import { userRoutes } from './routes/users.routes';
import { planRoutes } from './routes/plans.routes';
import { subscriptionRoutes } from './routes/subscriptions.routes';
import { paymentRoutes } from './routes/payments.routes';

export async function buildApp(): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger: {
      level: config.server.nodeEnv === 'development' ? 'info' : 'error',
    },
  });

  // Register CORS
  await fastify.register(cors, {
    origin: config.cors.origin,
    credentials: true,
  });

  // Register JWT
  await fastify.register(jwt, {
    secret: config.jwt.secret,
  });

  // Decorate fastify with auth middlewares
  fastify.decorate('authenticate', authenticate);
  fastify.decorate('requireAdmin', requireAdmin);

  // Register Swagger
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: config.app.name,
        description: 'API completa com autenticação JWT, integração Stripe e plataforma de assinaturas',
        version: '1.0.0',
        contact: {
          name: 'API Support',
          email: 'support@example.com',
        },
      },
      servers: [
        {
          url: config.app.url,
          description: 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      tags: [
        { name: 'Auth', description: 'Authentication endpoints' },
        { name: 'Users', description: 'User management endpoints' },
        { name: 'Plans', description: 'Subscription plan endpoints' },
        { name: 'Subscriptions', description: 'Subscription management endpoints' },
        { name: 'Payments', description: 'Payment and billing endpoints' },
      ],
    },
  });

  // Register Swagger UI
  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
    staticCSP: true,
  });

  // Error handler
  fastify.setErrorHandler(errorHandler);

  // Health check
  fastify.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: config.server.nodeEnv,
    };
  });

  // Register routes
  await fastify.register(authRoutes, { prefix: `/api/${config.server.apiVersion}/auth` });
  await fastify.register(userRoutes, { prefix: `/api/${config.server.apiVersion}/users` });
  await fastify.register(planRoutes, { prefix: `/api/${config.server.apiVersion}/plans` });
  await fastify.register(subscriptionRoutes, {
    prefix: `/api/${config.server.apiVersion}/subscriptions`,
  });
  await fastify.register(paymentRoutes, { prefix: `/api/${config.server.apiVersion}/payments` });

  return fastify;
}

// Type augmentation for Fastify
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any;
    requireAdmin: any;
  }
}
