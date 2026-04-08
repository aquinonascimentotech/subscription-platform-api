import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { stripe } from '../lib/stripe';
import { AppError } from '../utils/errors';
import { createSubscriptionSchema, cancelSubscriptionSchema } from '../schemas';

export async function subscriptionRoutes(fastify: FastifyInstance) {
  // Get user's subscriptions
  fastify.get('/', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['Subscriptions'],
      description: 'Get current user subscriptions',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const userId = (request.user as any).id;

    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
      include: {
        plan: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reply.send(subscriptions);
  });

  // Get subscription by ID
  fastify.get('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['Subscriptions'],
      description: 'Get subscription by ID',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const currentUser = request.user as any;

    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: {
        plan: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!subscription) {
      throw new AppError('Subscription not found', 404);
    }

    if (currentUser.role !== 'ADMIN' && subscription.userId !== currentUser.id) {
      throw new AppError('Forbidden', 403);
    }

    return reply.send(subscription);
  });

  // Create subscription
  fastify.post('/', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['Subscriptions'],
      description: 'Create a new subscription',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const userId = (request.user as any).id;
    const data = createSubscriptionSchema.parse(request.body);

    const plan = await prisma.plan.findUnique({
      where: { id: data.planId },
    });

    if (!plan || !plan.isActive) {
      throw new AppError('Plan not found or inactive', 404);
    }

    if (!plan.stripePriceId) {
      throw new AppError('Plan not configured with Stripe', 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
        },
      });

      stripeCustomerId = customer.id;

      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId },
      });
    }

    if (data.paymentMethodId) {
      await stripe.paymentMethods.attach(data.paymentMethodId, {
        customer: stripeCustomerId,
      });

      await stripe.customers.update(stripeCustomerId, {
        invoice_settings: {
          default_payment_method: data.paymentMethodId,
        },
      });
    }

    const stripeSubscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [
        {
          price: plan.stripePriceId,
        },
      ],
      trial_period_days: plan.trialPeriodDays || undefined,
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    });

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        planId: plan.id,
        stripeSubscriptionId: stripeSubscription.id,
        status: stripeSubscription.status.toUpperCase() as any,
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        trialStart: stripeSubscription.trial_start
          ? new Date(stripeSubscription.trial_start * 1000)
          : null,
        trialEnd: stripeSubscription.trial_end
          ? new Date(stripeSubscription.trial_end * 1000)
          : null,
      },
      include: {
        plan: true,
      },
    });

    return reply.status(201).send({
      subscription,
      clientSecret: (stripeSubscription.latest_invoice as any)?.payment_intent?.client_secret,
    });
  });

  // Cancel subscription
  fastify.post('/:id/cancel', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['Subscriptions'],
      description: 'Cancel a subscription',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const userId = (request.user as any).id;
    const data = cancelSubscriptionSchema.parse(request.body);

    const subscription = await prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      throw new AppError('Subscription not found', 404);
    }

    if (subscription.userId !== userId) {
      throw new AppError('Forbidden', 403);
    }

    if (subscription.status === 'CANCELED') {
      throw new AppError('Subscription already canceled', 400);
    }

    if (subscription.stripeSubscriptionId) {
      if (data.cancelAtPeriodEnd) {
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: true,
        });
      } else {
        await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
      }
    }

    const updated = await prisma.subscription.update({
      where: { id },
      data: {
        cancelAtPeriodEnd: data.cancelAtPeriodEnd,
        canceledAt: data.cancelAtPeriodEnd ? null : new Date(),
        status: data.cancelAtPeriodEnd ? subscription.status : 'CANCELED',
      },
      include: {
        plan: true,
      },
    });

    return reply.send(updated);
  });

  // Resume subscription
  fastify.post('/:id/resume', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['Subscriptions'],
      description: 'Resume a canceled subscription',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const userId = (request.user as any).id;

    const subscription = await prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      throw new AppError('Subscription not found', 404);
    }

    if (subscription.userId !== userId) {
      throw new AppError('Forbidden', 403);
    }

    if (!subscription.cancelAtPeriodEnd) {
      throw new AppError('Subscription is not set to cancel', 400);
    }

    if (subscription.stripeSubscriptionId) {
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: false,
      });
    }

    const updated = await prisma.subscription.update({
      where: { id },
      data: {
        cancelAtPeriodEnd: false,
        canceledAt: null,
      },
      include: {
        plan: true,
      },
    });

    return reply.send(updated);
  });

  // Get all subscriptions (Admin only)
  fastify.get('/admin/all', {
    onRequest: [fastify.requireAdmin],
    schema: {
      tags: ['Subscriptions'],
      description: 'Get all subscriptions (Admin only)',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const { status } = request.query as { status?: string };

    const where = status ? { status: status.toUpperCase() as any } : {};

    const subscriptions = await prisma.subscription.findMany({
      where,
      include: {
        plan: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reply.send(subscriptions);
  });
}
