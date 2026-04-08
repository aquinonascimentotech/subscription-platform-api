import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { stripe } from '../lib/stripe';
import { AppError } from '../utils/errors';
import { createPlanSchema, updatePlanSchema } from '../schemas';

export async function planRoutes(fastify: FastifyInstance) {
  // Get all plans
  fastify.get('/', {
    schema: {
      tags: ['Plans'],
      description: 'Get all available subscription plans',
    },
  }, async (request, reply) => {
    const { isActive } = request.query as { isActive?: boolean };

    const where = isActive !== undefined ? { isActive } : {};

    const plans = await prisma.plan.findMany({
      where,
      orderBy: {
        price: 'asc',
      },
    });

    return reply.send(plans);
  });

  // Get plan by ID
  fastify.get('/:id', {
    schema: {
      tags: ['Plans'],
      description: 'Get plan by ID',
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const plan = await prisma.plan.findUnique({
      where: { id },
      include: {
        _count: {
          select: { subscriptions: true },
        },
      },
    });

    if (!plan) {
      throw new AppError('Plan not found', 404);
    }

    return reply.send(plan);
  });

  // Create plan (Admin only)
  fastify.post('/', {
    onRequest: [fastify.requireAdmin],
    schema: {
      tags: ['Plans'],
      description: 'Create a new subscription plan (Admin only)',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const data = createPlanSchema.parse(request.body);

    const stripeProduct = await stripe.products.create({
      name: data.name,
      description: data.description || undefined,
    });

    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: Math.round(data.price * 100),
      currency: data.currency,
      recurring: {
        interval: data.interval as 'month' | 'year',
        interval_count: data.intervalCount,
        trial_period_days: data.trialPeriodDays,
      },
    });

    const plan = await prisma.plan.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        currency: data.currency,
        interval: data.interval,
        intervalCount: data.intervalCount,
        trialPeriodDays: data.trialPeriodDays,
        features: data.features,
        isActive: data.isActive,
        stripePriceId: stripePrice.id,
        stripeProductId: stripeProduct.id,
      },
    });

    return reply.status(201).send(plan);
  });

  // Update plan (Admin only)
  fastify.patch('/:id', {
    onRequest: [fastify.requireAdmin],
    schema: {
      tags: ['Plans'],
      description: 'Update a subscription plan (Admin only)',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = updatePlanSchema.parse(request.body);

    const existingPlan = await prisma.plan.findUnique({
      where: { id },
    });

    if (!existingPlan) {
      throw new AppError('Plan not found', 404);
    }

    if (existingPlan.stripeProductId && (data.name || data.description)) {
      await stripe.products.update(existingPlan.stripeProductId, {
        name: data.name,
        description: data.description,
      });
    }

    const plan = await prisma.plan.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        features: data.features,
        isActive: data.isActive,
      },
    });

    return reply.send(plan);
  });

  // Delete plan (Admin only)
  fastify.delete('/:id', {
    onRequest: [fastify.requireAdmin],
    schema: {
      tags: ['Plans'],
      description: 'Delete a subscription plan (Admin only)',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const plan = await prisma.plan.findUnique({
      where: { id },
      include: {
        _count: {
          select: { subscriptions: true },
        },
      },
    });

    if (!plan) {
      throw new AppError('Plan not found', 404);
    }

    if (plan._count.subscriptions > 0) {
      throw new AppError('Cannot delete plan with active subscriptions', 400);
    }

    if (plan.stripeProductId) {
      await stripe.products.update(plan.stripeProductId, {
        active: false,
      });
    }

    await prisma.plan.delete({
      where: { id },
    });

    return reply.status(204).send();
  });
}
