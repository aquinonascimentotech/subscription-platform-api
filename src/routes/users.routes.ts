import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { hashPassword } from '../utils/hash';
import { AppError } from '../utils/errors';
import { updateUserSchema } from '../schemas';

export async function userRoutes(fastify: FastifyInstance) {
  // Get all users (Admin only)
  fastify.get('/', {
    onRequest: [fastify.requireAdmin],
    schema: {
      tags: ['Users'],
      description: 'Get all users (Admin only)',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const users = await prisma.user.findMany({
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

    return reply.send(users);
  });

  // Get user by ID
  fastify.get('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['Users'],
      description: 'Get user by ID',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const currentUser = request.user as any;

    if (currentUser.role !== 'ADMIN' && currentUser.id !== id) {
      throw new AppError('Forbidden', 403);
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        stripeCustomerId: true,
        createdAt: true,
        updatedAt: true,
        subscriptions: {
          include: {
            plan: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return reply.send(user);
  });

  // Update user
  fastify.patch('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['Users'],
      description: 'Update user',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const currentUser = request.user as any;
    const data = updateUserSchema.parse(request.body);

    if (currentUser.role !== 'ADMIN' && currentUser.id !== id) {
      throw new AppError('Forbidden', 403);
    }

    const updateData: any = {};

    if (data.name) updateData.name = data.name;
    if (data.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existingUser && existingUser.id !== id) {
        throw new AppError('Email already in use', 409);
      }
      updateData.email = data.email;
    }
    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return reply.send(user);
  });

  // Delete user (Admin only)
  fastify.delete('/:id', {
    onRequest: [fastify.requireAdmin],
    schema: {
      tags: ['Users'],
      description: 'Delete user (Admin only)',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };

    await prisma.user.delete({
      where: { id },
    });

    return reply.status(204).send();
  });
}
