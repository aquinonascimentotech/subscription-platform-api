import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { stripe } from '../lib/stripe';
import { AppError } from '../utils/errors';
import { createPaymentIntentSchema } from '../schemas';

export async function paymentRoutes(fastify: FastifyInstance) {
  // Get user's payments
  fastify.get('/', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['Payments'],
      description: 'Get current user payments',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const userId = (request.user as any).id;

    const payments = await prisma.payment.findMany({
      where: { userId },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reply.send(payments);
  });

  // Get payment by ID
  fastify.get('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['Payments'],
      description: 'Get payment by ID',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const currentUser = request.user as any;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });

    if (!payment) {
      throw new AppError('Payment not found', 404);
    }

    if (currentUser.role !== 'ADMIN' && payment.userId !== currentUser.id) {
      throw new AppError('Forbidden', 403);
    }

    return reply.send(payment);
  });

  // Create payment intent
  fastify.post('/create-intent', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['Payments'],
      description: 'Create a payment intent',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const userId = (request.user as any).id;
    const data = createPaymentIntentSchema.parse(request.body);

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

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(data.amount * 100),
      currency: data.currency,
      customer: stripeCustomerId,
      description: data.description,
      metadata: {
        userId: user.id,
      },
    });

    const payment = await prisma.payment.create({
      data: {
        userId,
        stripePaymentIntentId: paymentIntent.id,
        amount: data.amount,
        currency: data.currency,
        status: 'PENDING',
        description: data.description,
      },
    });

    return reply.status(201).send({
      payment,
      clientSecret: paymentIntent.client_secret,
    });
  });

  // Stripe webhook
  fastify.post('/webhook', {
    config: {
      rawBody: true,
    },
    schema: {
      tags: ['Payments'],
      description: 'Stripe webhook endpoint',
      hide: true,
    },
  }, async (request, reply) => {
    const signature = request.headers['stripe-signature'] as string;

    if (!signature) {
      throw new AppError('Missing stripe-signature header', 400);
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        request.rawBody as Buffer,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      throw new AppError(`Webhook signature verification failed: ${err.message}`, 400);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return reply.send({ received: true });
  });

  // Get all payments (Admin only)
  fastify.get('/admin/all', {
    onRequest: [fastify.requireAdmin],
    schema: {
      tags: ['Payments'],
      description: 'Get all payments (Admin only)',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const { status } = request.query as { status?: string };

    const where = status ? { status: status.toUpperCase() as any } : {};

    const payments = await prisma.payment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        subscription: {
          include: {
            plan: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reply.send(payments);
  });
}

// Helper functions for webhook handlers
async function handlePaymentIntentSucceeded(paymentIntent: any) {
  const payment = await prisma.payment.findUnique({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (payment) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'SUCCEEDED' },
    });
  }
}

async function handlePaymentIntentFailed(paymentIntent: any) {
  const payment = await prisma.payment.findUnique({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (payment) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'FAILED' },
    });
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (dbSubscription) {
    await prisma.subscription.update({
      where: { id: dbSubscription.id },
      data: {
        status: subscription.status.toUpperCase(),
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    });
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (dbSubscription) {
    await prisma.subscription.update({
      where: { id: dbSubscription.id },
      data: {
        status: 'CANCELED',
        canceledAt: new Date(),
      },
    });
  }
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  const subscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: invoice.subscription },
    include: { plan: true },
  });

  if (subscription) {
    await prisma.payment.create({
      data: {
        userId: subscription.userId,
        subscriptionId: subscription.id,
        amount: invoice.amount_paid / 100,
        currency: invoice.currency,
        status: 'SUCCEEDED',
        description: `Payment for ${subscription.plan.name}`,
        metadata: {
          invoiceId: invoice.id,
          stripeSubscriptionId: invoice.subscription,
        },
      },
    });
  }
}

async function handleInvoicePaymentFailed(invoice: any) {
  const subscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: invoice.subscription },
  });

  if (subscription) {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: 'PAST_DUE' },
    });
  }
}
