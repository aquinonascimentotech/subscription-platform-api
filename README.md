# Subscription Platform API

API REST completa para plataformas de assinatura SaaS com autenticação JWT, gerenciamento de planos, processamento de pagamentos via Stripe e sincronização em tempo real através de webhooks.

## 🚀 Tecnologias

- **Node.js** + **TypeScript** - Runtime e linguagem
- **Fastify** - Framework web de alta performance
- **Prisma** - ORM type-safe
- **PostgreSQL** - Banco de dados relacional
- **Stripe** - Processamento de pagamentos
- **JWT** + **bcrypt** - Autenticação e segurança
- **Zod** - Validação de schemas
- **Docker** - Containerização
- **Swagger** - Documentação automática

## ✨ Funcionalidades

- **Autenticação completa**: Registro, login, JWT tokens e sistema de roles (USER/ADMIN)
- **Gestão de usuários**: CRUD completo com controle de permissões
- **Planos flexíveis**: Criação de planos mensais/anuais com período de trial e features customizáveis
- **Sistema de assinaturas**: Criação, cancelamento, reativação e upgrade/downgrade
- **Pagamentos Stripe**: Checkout sessions, payment intents e webhooks para sincronização
- **Documentação interativa**: Swagger UI em `/docs`
- **Validação robusta**: Schemas Zod em todas as rotas
- **Type-safe**: TypeScript em todo o projeto

## 📦 Instalação

### Pré-requisitos

- Node.js 18+
- PostgreSQL 14+ ou Docker
- Conta Stripe (chaves de teste)

### Setup

```bash
# Clone o repositório
git clone https://github.com/aquinonascimentotech/subscription-platform-api.git
cd subscription-platform-api

# Instale as dependências
npm install

# Configure as variáveis de ambiente (copie .env.example para .env)
cp .env.example .env
# Edite .env com suas credenciais Stripe e database URL

# Inicie o PostgreSQL com Docker
docker-compose up -d postgres

# Configure o banco de dados
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed  # (Opcional) dados de exemplo

# Inicie o servidor
npm run dev
```

A API estará rodando em `http://localhost:3000`

### Docker (Modo Completo)

```bash
# Inicia todos os serviços (API + PostgreSQL)
docker-compose up -d

# Para os serviços
docker-compose down
```

## 📖 Documentação da API

### Endpoints Principais

| Recurso | Descrição |
|---------|-----------|
| **Swagger UI** | http://localhost:3000/docs |
| **Health Check** | http://localhost:3000/health |
| **API Base** | http://localhost:3000/api/v1 |

### Rotas

#### Autenticação (`/api/v1/auth`)
- `POST /register` - Registrar novo usuário
- `POST /login` - Login e geração de JWT

#### Usuários (`/api/v1/users`)
- `GET /me` - Obter perfil do usuário autenticado
- `PATCH /me` - Atualizar perfil
- `GET /` - Listar usuários (ADMIN)

#### Planos (`/api/v1/plans`)
- `GET /` - Listar planos (público)
- `POST /` - Criar plano (ADMIN)
- `PATCH /:id` - Atualizar plano (ADMIN)
- `DELETE /:id` - Deletar plano (ADMIN)

#### Assinaturas (`/api/v1/subscriptions`)
- `GET /` - Listar assinaturas do usuário
- `GET /:id` - Obter detalhes de assinatura
- `POST /:id/cancel` - Cancelar assinatura

#### Pagamentos (`/api/v1/payments`)
- `POST /checkout` - Criar checkout session
- `POST /intent` - Criar payment intent
- `POST /webhook` - Webhook do Stripe

**📚 Documentação completa e exemplos de requisições**: http://localhost:3000/docs

## 🏗️ Estrutura do Projeto

```
subscription-platform-api/
├── prisma/
│   ├── schema.prisma       # Schema do banco
│   └── seed.ts             # Dados iniciais
├── src/
│   ├── config/             # Configurações
│   ├── lib/                # Prisma e Stripe clients
│   ├── middlewares/        # Autenticação
│   ├── routes/             # Rotas da API
│   ├── schemas/            # Validação Zod
│   ├── types/              # TypeScript types
│   ├── utils/              # Helpers
│   ├── app.ts              # Configuração Fastify
│   └── server.ts           # Entry point
├── docker-compose.yml
└── package.json
```

## 🔧 Scripts Disponíveis

```bash
npm run dev              # Desenvolvimento com hot reload
npm run build            # Build para produção
npm start                # Inicia em produção
npm run prisma:generate  # Gera Prisma Client
npm run prisma:migrate   # Executa migrations
npm run prisma:studio    # Interface do banco
npm run lint             # ESLint
npm run format           # Prettier
```

## 📝 Licença

Este projeto está sob a licença MIT.

---

Desenvolvido por [Aquino Nascimento Tech](https://github.com/aquinonascimentotech)
