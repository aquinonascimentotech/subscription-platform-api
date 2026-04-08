import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Criar usuário admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Criar usuário normal
  const userPassword = await bcrypt.hash('user123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      name: 'Regular User',
      role: 'USER',
    },
  });

  console.log('✅ Regular user created:', user.email);

  // Criar planos de assinatura
  const plans = [
    {
      name: 'Basic',
      description: 'Perfect for individuals and small projects',
      price: 9.99,
      currency: 'usd',
      interval: 'month',
      intervalCount: 1,
      trialPeriodDays: 7,
      features: [
        'Up to 10 projects',
        'Basic support',
        '5GB storage',
        'Email notifications',
      ],
      isActive: true,
    },
    {
      name: 'Pro',
      description: 'For professionals and growing teams',
      price: 29.99,
      currency: 'usd',
      interval: 'month',
      intervalCount: 1,
      trialPeriodDays: 14,
      features: [
        'Unlimited projects',
        'Priority support',
        '50GB storage',
        'Advanced analytics',
        'Custom integrations',
        'Email & SMS notifications',
      ],
      isActive: true,
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with custom needs',
      price: 99.99,
      currency: 'usd',
      interval: 'month',
      intervalCount: 1,
      trialPeriodDays: 30,
      features: [
        'Unlimited everything',
        'Dedicated support',
        'Unlimited storage',
        'Advanced analytics & reporting',
        'Custom integrations',
        'White-label options',
        'SLA guarantee',
        'Custom training',
      ],
      isActive: true,
    },
    {
      name: 'Pro Annual',
      description: 'Pro plan billed annually (save 20%)',
      price: 287.90,
      currency: 'usd',
      interval: 'year',
      intervalCount: 1,
      trialPeriodDays: 14,
      features: [
        'Unlimited projects',
        'Priority support',
        '50GB storage',
        'Advanced analytics',
        'Custom integrations',
        'Email & SMS notifications',
        '20% discount',
      ],
      isActive: true,
    },
  ];

  for (const plan of plans) {
    const created = await prisma.plan.upsert({
      where: { 
        name: plan.name,
      },
      update: {},
      create: plan,
    });
    console.log('✅ Plan created:', created.name);
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
