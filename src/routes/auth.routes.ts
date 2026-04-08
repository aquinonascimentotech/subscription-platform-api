import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { hashPassword, comparePassword } from '../utils/hash';
import { AppError } from '../utils/errors';
import { registerSchema, loginSchema } from '../schemas';

export async function authRoutes(fastify: FastifyInstance) {
  // Register
  fastify.post('/register', {
    schema: {
      tags: ['Auth'],
      description: 'Register a new user',
      body: {
        type: 'object',
        required: ['email', 'password', 'name'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          name: { type: 'string', minLength: 2 },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            user: { type: 'object' },
            token: { type: 'string' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const data = registerSchema.parse(request.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return reply.status(201).send({ user, token });
  });

  // Login
  fastify.post('/login', {
    schema: {
      tags: ['Auth'],
      description: 'Login with email and password',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            user: { type: 'object' },
            token: { type: 'string' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const data = loginSchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValidPassword = await comparePassword(data.password, user.password);

    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const { password: _, ...userWithoutPassword } = user;

    return reply.send({ user: userWithoutPassword, token });
  });

  // Get current user
  fastify.get('/me', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['Auth'],
      description: 'Get current authenticated user',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const userId = (request.user as any).id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        stripeCustomerId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return reply.send(user);
  });
}
