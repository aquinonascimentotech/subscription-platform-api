<div align="center">

# 🚀 Subscription Platform API

### *Plataforma Completa de Assinaturas com Stripe*

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)](https://www.fastify.io/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

**API REST profissional com autenticação JWT, sistema de assinaturas recorrentes e processamento de pagamentos via Stripe**

[Funcionalidades](#-funcionalidades) •
[Tecnologias](#-stack-tecnológica) •
[Instalação](#-instalação) •
[Uso](#-como-usar) •
[API Docs](#-documentação-da-api) •
[Licença](#-licença)

</div>

---

## 📋 Sobre o Projeto

Uma **API REST completa e production-ready** para plataformas de assinatura SaaS. Implementa autenticação segura, gerenciamento de usuários, planos flexíveis, processamento de pagamentos com Stripe e webhooks para sincronização em tempo real.

### 🎯 Principais Diferenciais

- 🔐 **Autenticação Robusta** - JWT com bcrypt e middleware de proteção
- 💳 **Stripe Integrado** - Payment Intents, Webhooks e sincronização automática
- 📊 **Modelagem Completa** - Prisma ORM com PostgreSQL
- 🚀 **Alta Performance** - Fastify (até 3x mais rápido que Express)
- 📚 **Auto-Documentada** - Swagger UI integrado
- 🐳 **Docker Ready** - Configuração completa com Docker Compose
- ✅ **Validação Forte** - Schemas Zod em todas as rotas
- 🎨 **Code Quality** - TypeScript, ESLint e Prettier configurados

---

## ✨ Funcionalidades

### 🔐 Autenticação & Autorização
- ✅ Registro de usuários com validação de dados
- ✅ Hash seguro de senhas com bcrypt
- ✅ Login com geração de JWT
- ✅ Middleware de autenticação e autorização
- ✅ Sistema de roles (USER, ADMIN)
- ✅ Proteção de rotas por permissão

### 👥 Gestão de Usuários
- ✅ CRUD completo de usuários
- ✅ Perfil do usuário autenticado
- ✅ Atualização de dados pessoais
- ✅ Histórico de assinaturas
- ✅ Controle de permissões por role

### 📋 Planos de Assinatura
- ✅ CRUD de planos com validação
- ✅ Planos mensais, anuais ou customizados
- ✅ Período de trial configurável
- ✅ Lista de features por plano
- ✅ Sincronização automática com Stripe Products
- ✅ Suporte a múltiplas moedas

### 💳 Sistema de Assinaturas
- ✅ Criação de assinaturas
- ✅ Renovação automática
- ✅ Cancelamento (imediato ou ao fim do período)
- ✅ Reativação de assinaturas canceladas
- ✅ Upgrade/Downgrade de planos
- ✅ Status em tempo real (ACTIVE, CANCELED, PAST_DUE, etc)
- ✅ Gestão de período de trial

### 💰 Processamento de Pagamentos (Stripe)
- ✅ Criação de checkout sessions
- ✅ Payment Intents para pagamentos únicos
- ✅ Webhooks para eventos do Stripe
- ✅ Sincronização automática de status
- ✅ Histórico completo de transações
- ✅ Suporte a diferentes métodos de pagamento
- ✅ Tratamento de falhas de pagamento

### 📚 Documentação & Developer Experience
- ✅ Swagger UI interativo (`/docs`)
- ✅ OpenAPI 3.0 specification
- ✅ Schemas de validação documentados
- ✅ Exemplos de requisições
- ✅ Health check endpoint
- ✅ Error handling padronizado

---

## 🛠️ Stack Tecnológica

### Core
- **[Node.js](https://nodejs.org/)** `20.x` - Runtime JavaScript
- **[TypeScript](https://www.typescriptlang.org/)** `5.x` - Linguagem com tipagem estática
- **[Fastify](https://www.fastify.io/)** `4.x` - Framework web de alta performance
- **[Prisma](https://www.prisma.io/)** `5.x` - ORM moderno para Node.js

### Database
- **[PostgreSQL](https://www.postgresql.org/)** `16` - Banco de dados relacional
- **[Docker](https://www.docker.com/)** - Containerização

### Autenticação & Segurança
- **[@fastify/jwt](https://github.com/fastify/fastify-jwt)** - Autenticação JWT
- **[bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - Hash de senhas
- **[Zod](https://github.com/colinhacks/zod)** - Validação de schemas

### Pagamentos
- **[Stripe](https://stripe.com/)** - Processamento de pagamentos
- **Webhooks** - Sincronização em tempo real

### Documentação
- **[@fastify/swagger](https://github.com/fastify/fastify-swagger)** - Geração de OpenAPI
- **[@fastify/swagger-ui](https://github.com/fastify/fastify-swagger-ui)** - Interface interativa

### Desenvolvimento
- **[tsx](https://github.com/esbuild-kit/tsx)** - TypeScript execution
- **[tsup](https://github.com/egoist/tsup)** - Build tool
- **[ESLint](https://eslint.org/)** - Linting
- **[Prettier](https://prettier.io/)** - Code formatting

### 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** `18+` ([Download](https://nodejs.org/))
- **PostgreSQL** `14+` ([Download](https://www.postgresql.org/download/))
- **Docker** (opcional, mas recomendado) ([Download](https://www.docker.com/))
- **Conta Stripe** ([Criar conta](https://dashboard.stripe.com/register))

### 📥 Passo a Passo

#### 1️⃣ Clone o repositório

\`\`\`bash
git clone https://github.com/aquinonascimentotech/subscription-platform-api.git
cd subscription-platform-api
\`\`\`

#### 2️⃣ Instale as dependências

\`\`\`bash
npm install
\`\`\`

#### 3️⃣ Configure as variáveis de ambiente

Crie um arquivo \`.env\` na raiz do projeto:

\`\`\`env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/subscription_platform?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Stripe (obtenha suas chaves em: https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Server
PORT=3000
NODE_ENV="development"
API_VERSION="v1"

# CORS
CORS_ORIGIN="*"

# App
APP_NAME="Subscription Platform API"
APP_URL="http://localhost:3000"
\`\`\`

> 💡 **Dica**: Obtenha suas chaves da Stripe em https://dashboard.stripe.com/test/apikeys

#### 4️⃣ Inicie o banco de dados com Docker (recomendado)

\`\`\`bash
# Inicia o PostgreSQL em container
docker-compose up -d postgres

# Verifica se está rodando
docker-compose ps
\`\`\`

**Ou use seu PostgreSQL local** e ajuste a \`DATABASE_URL\` no \`.env\`

#### 5️⃣ Configure o banco de dados

\`\`\`bash
# Gera o Prisma Client
npm run prisma:generate

# Executa as migrations
npm run prisma:migrate

# (Opcional) Popula com dados de exemplo
npm run prisma:seed
\`\`\`

#### 6️⃣ Inicie o servidor

\`\`\`bash
# Desenvolvimento (com hot reload)
npm run dev

# Build de produção
npm run build
npm start
\`\`\`

✅ **Pronto!** A API está rodando em **http://localhost:3000** 🎉

---

## 🐳 Docker Compose (Modo Completo)

Para rodar toda a aplicação (API + PostgreSQL) com Docker:

\`\`\`bash
# Inicia todos os serviços
docker-compose up -d

# Visualiza os logs
docker-compose logs -f

# Para os serviços
docker-compose down

# Remove volumes (limpa banco de dados)
docker-compose down -v
\`\`\`

---

## 📖 Documentação da API

### 🌐 Endpoints Disponíveis

Após iniciar o servidor, acesse:

| Recurso | URL | Descrição |
|---------|-----|-----------|
| 📚 **Swagger UI** | http://localhost:3000/docs | Documentação interativa completa |
| 🏥 **Health Check** | http://localhost:3000/health | Status da aplicação |
| 🔌 **API Base** | http://localhost:3000/api/v1 | Base URL da API |

### 🔑 Rotas Principais

<details>
<summary><b>🔐 Autenticação (/api/v1/auth)</b></summary>

#### Registrar Usuário
\`\`\`bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
\`\`\`

#### Login
\`\`\`bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "senha123"
}

# Resposta:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "USER"
  }
}
\`\`\`

</details>

<details>
<summary><b>👤 Usuários (/api/v1/users)</b></summary>

#### Obter Perfil
\`\`\`bash
GET /api/v1/users/me
Authorization: Bearer {token}
\`\`\`

#### Atualizar Perfil
\`\`\`bash
PATCH /api/v1/users/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "João Pedro Silva"
}
\`\`\`

#### Listar Usuários (ADMIN)
\`\`\`bash
GET /api/v1/users
Authorization: Bearer {admin_token}
\`\`\`

</details>

<details>
<summary><b>📋 Planos (/api/v1/plans)</b></summary>

#### Listar Planos
\`\`\`bash
GET /api/v1/plans

# Resposta:
[
  {
    "id": "uuid",
    "name": "Plano Premium",
    "description": "Acesso completo",
    "price": 9999,
    "currency": "BRL",
    "interval": "MONTHLY",
    "features": ["Feature 1", "Feature 2"],
    "trialDays": 7,
    "active": true
  }
]
\`\`\`

#### Criar Plano (ADMIN)
\`\`\`bash
POST /api/v1/plans
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Plano Enterprise",
  "description": "Para grandes empresas",
  "price": 29999,
  "currency": "BRL",
  "interval": "MONTHLY",
  "features": ["Unlimited users", "24/7 Support", "Custom integrations"],
  "trialDays": 14
}
\`\`\`

</details>

<details>
<summary><b>💳 Assinaturas (/api/v1/subscriptions)</b></summary>

#### Listar Minhas Assinaturas
\`\`\`bash
GET /api/v1/subscriptions
Authorization: Bearer {token}
\`\`\`

#### Obter Detalhes de uma Assinatura
\`\`\`bash
GET /api/v1/subscriptions/{subscriptionId}
Authorization: Bearer {token}
\`\`\`

#### Cancelar Assinatura
\`\`\`bash
POST /api/v1/subscriptions/{subscriptionId}/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "cancelAtPeriodEnd": true
}
\`\`\`

</details>

<details>
<summary><b>💰 Pagamentos (/api/v1/payments)</b></summary>

#### Criar Checkout Session
\`\`\`bash
POST /api/v1/payments/checkout
Authorization: Bearer {token}
Content-Type: application/json

{
  "planId": "plan-uuid"
}

# Resposta:
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
\`\`\`

#### Criar Payment Intent
\`\`\`bash
POST /api/v1/payments/intent
Authorization: Bearer {token}
Content-Type: application/json

{
  "planId": "plan-uuid"
}
\`\`\`

#### Webhook do Stripe
\`\`\`bash
POST /api/v1/payments/webhook
Stripe-Signature: {stripe_signature}

# Eventos tratados:
# - checkout.session.completed
# - invoice.paid
# - invoice.payment_failed
# - customer.subscription.updated
# - customer.subscription.deleted
\`\`\`

</details>

---

## 🏗️ Estrutura do Projeto

\`\`\`
subscription-platform-api/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── seed.ts                # Dados iniciais
├── src/
│   ├── config/
│   │   └── index.ts           # Configurações da aplicação
│   ├── lib/
│   │   ├── prisma.ts          # Cliente Prisma
│   │   └── stripe.ts          # Cliente Stripe
│   ├── middlewares/
│   │   └── auth.ts            # Middleware de autenticação
│   ├── routes/
│   │   ├── auth.routes.ts     # Rotas de autenticação
│   │   ├── plans.routes.ts    # Rotas de planos
│   │   ├── subscriptions.routes.ts
│   │   ├── payments.routes.ts
│   │   └── users.routes.ts
│   ├── schemas/
│   │   └── index.ts           # Schemas Zod de validação
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   ├── utils/
│   │   ├── errors.ts          # Error handlers
│   │   └── hash.ts            # Funções de hash
│   ├── app.ts                 # Configuração do Fastify
│   └── server.ts              # Entry point
├── .env                       # Variáveis de ambiente
├── docker-compose.yml         # Docker compose config
├── Dockerfile                 # Docker image
├── package.json
├── tsconfig.json
└── README.md
\`\`\`

---

## 🧪 Testando a API

### Usando o script automatizado

\`\`\`bash
# Windows PowerShell
powershell -ExecutionPolicy Bypass -File test-api.ps1

# Linux/Mac Bash
chmod +x test-api.sh
./test-api.sh
\`\`\`

### Testes manuais com curl

Consulte o arquivo [TESTS.md](TESTS.md) para exemplos detalhados de requisições.

### Swagger UI

A forma mais fácil de testar é usar a interface Swagger:

👉 http://localhost:3000/docs

---

## 📊 Modelagem do Banco de Dados

### Principais Entidades

\`\`\`prisma
model User {
  id           String         @id @default(uuid())
  name         String
  email        String         @unique
  password     String
  role         Role           @default(USER)
  subscriptions Subscription[]
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
}

model Plan {
  id          String         @id @default(uuid())
  name        String
  description String?
  price       Int
  currency    String         @default("BRL")
  interval    Interval
  features    String[]
  trialDays   Int?
  active      Boolean        @default(true)
  stripeProductId String?    @unique
  stripePriceId   String?    @unique
}

model Subscription {
  id              String             @id @default(uuid())
  userId          String
  planId          String
  status          SubscriptionStatus
  stripeSubscriptionId String?       @unique
  currentPeriodStart   DateTime?
  currentPeriodEnd     DateTime?
  cancelAtPeriodEnd    Boolean        @default(false)
}
\`\`\`

---

## 🔧 Scripts Disponíveis

\`\`\`bash
# Desenvolvimento
npm run dev              # Inicia com hot reload
npm run build            # Build para produção
npm start                # Inicia em produção

# Prisma
npm run prisma:generate  # Gera Prisma Client
npm run prisma:migrate   # Executa migrations
npm run prisma:studio    # Abre UI do banco
npm run prisma:seed      # Popula dados iniciais

# Qualidade de Código
npm run lint             # Executa ESLint
npm run format           # Formata com Prettier
npm test                 # Executa testes
npm run test:coverage    # Testes com cobertura
\`\`\`

---

## 🌍 Variáveis de Ambiente

| Variável | Descrição | Padrão | Obrigatória |
|----------|-----------|--------|-------------|
| \`DATABASE_URL\` | URL de conexão PostgreSQL | - | ✅ |
| \`JWT_SECRET\` | Chave secreta para JWT | - | ✅ |
| \`JWT_EXPIRES_IN\` | Tempo de expiração do JWT | \`7d\` | ❌ |
| \`STRIPE_SECRET_KEY\` | Chave secreta da Stripe | - | ✅ |
| \`STRIPE_PUBLISHABLE_KEY\` | Chave pública da Stripe | - | ✅ |
| \`STRIPE_WEBHOOK_SECRET\` | Secret dos webhooks Stripe | - | ✅ |
| \`PORT\` | Porta do servidor | \`3000\` | ❌ |
| \`NODE_ENV\` | Ambiente de execução | \`development\` | ❌ |
| \`CORS_ORIGIN\` | Origem permitida para CORS | \`*\` | ❌ |

---

## 🚀 Deploy

### Plataformas Recomendadas

- **[Render](https://render.com/)** - Deploy fácil com PostgreSQL
- **[Railway](https://railway.app/)** - Deploy automático e banco de dados
- **[Heroku](https://heroku.com/)** - Clássico e confiável
- **[DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)** - Full control
- **[AWS](https://aws.amazon.com/)** - Escalável para produção

### Checklist de Deploy

- [ ] Configure variáveis de ambiente em produção
- [ ] Use \`NODE_ENV=production\`
- [ ] Troque \`JWT_SECRET\` por uma chave forte e única
- [ ] Use chaves **live** da Stripe (não test)
- [ ] Configure webhook da Stripe em produção
- [ ] Habilite SSL/HTTPS
- [ ] Configure CORS para seu domínio específico
- [ ] Execute migrations: \`npm run prisma:migrate\`
- [ ] Configure backups do banco de dados
- [ ] Monitore logs e erros

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Siga os passos:

1. Fork o projeto
2. Crie uma branch para sua feature (\`git checkout -b feature/MinhaFeature\`)
3. Commit suas mudanças (\`git commit -m 'Adiciona MinhaFeature'\`)
4. Push para a branch (\`git push origin feature/MinhaFeature\`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Felipe de Aquino Nascimento**

- GitHub: [@aquinonascimentotech](https://github.com/aquinonascimentotech)

---

## 🙏 Agradecimentos

- [Fastify](https://www.fastify.io/) - Framework rápido e eficiente
- [Prisma](https://www.prisma.io/) - ORM incrível
- [Stripe](https://stripe.com/) - Plataforma de pagamentos completa
- Comunidade open source 💙

---

<div align="center">

**⭐ Se este projeto foi útil para você, considere dar uma estrela!**

**Desenvolvido com ❤️ e ☕**

</div>
