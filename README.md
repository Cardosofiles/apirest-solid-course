<div align="center">

# GymPass Style API

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Fastify-5.8-000000?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify" />
  <img src="https://img.shields.io/badge/Prisma-7.6-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vitest-4.1-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/pnpm-10.33-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm" />
  <img src="https://img.shields.io/badge/Zod-4.3-3068B7?style=for-the-badge&logo=zod&logoColor=white" alt="Zod" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Architecture-SOLID-blueviolet?style=for-the-badge" alt="SOLID" />
  <img src="https://img.shields.io/badge/Pattern-Repository-orange?style=for-the-badge" alt="Repository Pattern" />
  <img src="https://img.shields.io/badge/Auth-JWT%20%2B%20Refresh%20Token-red?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" alt="GitHub Actions" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-ISC-green?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs welcome" />
  <img src="https://img.shields.io/github/last-commit/Cardosofiles/apirest-solid-course?style=flat-square" alt="Last commit" />
</p>

---

**API RESTful no estilo GymPass** — cadastro de academias, check-in geolocalizado e controle de acesso por papéis (ADMIN / MEMBER), construída com rigor nos princípios SOLID.

</div>

---

## Sumário

- [Sobre o Projeto](#-sobre-o-projeto)
- [Regras de Negócio](#-regras-de-negócio)
- [Arquitetura](#-arquitetura)
- [Endpoints da API](#-endpoints-da-api)
- [Modelos de Dados](#-modelos-de-dados)
- [Stack Tecnológica](#-stack-tecnológica)
- [Como Executar](#-como-executar)
- [Testes](#-testes)
- [CI/CD](#-cicd)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Autor](#-autor)

---

## Sobre o Projeto

A **GymPass Style API** é uma API RESTful que replica o core de um serviço de assinatura de academias. Ela permite que usuários se cadastrem, autentiquem, localizem academias próximas por geolocalização e realizem check-ins diários. Administradores podem cadastrar academias e validar check-ins presencialmente.

O projeto foi desenvolvido como laboratório de boas práticas de engenharia de software em Node.js, com foco em:

- **Princípios SOLID** aplicados em cada camada da aplicação
- **Repository Pattern** com inversão de dependência entre Use Cases e persistência
- **Factory Pattern** para composição de casos de uso sem acoplamento
- **Testes em dupla camada**: unitários (Use Cases isolados) e E2E (HTTP real + banco de dados real)
- **Autenticação stateless** com JWT de curta duração + Refresh Token via cookie `HttpOnly`

---

## Regras de Negócio

### Usuários
- Cadastro único por e-mail (duplicatas retornam erro)
- Senha armazenada como hash `bcrypt`
- Papéis: `MEMBER` (padrão) e `ADMIN`
- Acesso ao próprio perfil autenticado

### Academias
- Somente `ADMIN` pode cadastrar academias
- Busca por nome (texto parcial) com paginação
- Busca por proximidade geográfica (até **10 km** do usuário)

### Check-ins
- Apenas **1 check-in por dia por academia**
- A academia deve estar dentro de **100 metros** da coordenada informada
- Validação do check-in (presencial) apenas por `ADMIN`
- Validação permitida somente até **20 minutos** após a criação do check-in
- Histórico paginado de check-ins do usuário autenticado
- Métrica de total de check-ins realizados

---

## Arquitetura

```
src/
├── app.ts                         # Bootstrap do Fastify (plugins, rotas, error handler)
├── server.ts                      # Entry point (listen)
├── config/
│   └── env.ts                     # Variáveis de ambiente validadas com Zod
├── db/
│   └── prisma.ts                  # Singleton do PrismaClient
├── http/
│   ├── controllers/
│   │   ├── users/                 # register · authenticate · profile · refresh
│   │   ├── gyms/                  # create · search · nearby
│   │   └── check-ins/             # create · validate · history · metrics
│   └── middlewares/
│       ├── verify-jwt.ts          # Guarda JWT em todas as rotas protegidas
│       └── verify-user-role.ts    # RBAC — restringe rotas por papel
├── use-cases/
│   ├── *.ts                       # Casos de uso (lógica de negócio pura)
│   ├── errors/                    # Erros de domínio tipados
│   └── factories/                 # Fábricas de injeção de dependência
└── repositories/
    ├── interfaces/                # Contratos (inversão de dependência)
    └── prisma/                    # Implementações Prisma dos repositórios
```

### Princípios SOLID em prática

| Princípio | Aplicação |
|-----------|-----------|
| **S** — Single Responsibility | Cada Use Case resolve exatamente um caso de uso de negócio |
| **O** — Open/Closed | Novos repositórios são adicionados implementando a interface, sem alterar Use Cases |
| **L** — Liskov Substitution | In-memory repositories nos testes unitários substituem os Prisma sem quebrar contratos |
| **I** — Interface Segregation | Repositórios têm interfaces separadas (`IUsersRepository`, `IGymsRepository`, `ICheckInsRepository`) |
| **D** — Dependency Inversion | Use Cases dependem de abstrações (interfaces), não de `PrismaClient` diretamente |

---

## Endpoints da API

### Usuários

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/users` | — | Cadastrar novo usuário |
| `POST` | `/sessions` | — | Autenticar e obter JWT |
| `PATCH` | `/token/refresh` | Cookie | Renovar access token |
| `GET` | `/me` | JWT | Perfil do usuário autenticado |

### Academias

| Método | Rota | Auth | Role | Descrição |
|--------|------|------|------|-----------|
| `POST` | `/gyms` | JWT | ADMIN | Cadastrar academia |
| `GET` | `/gyms/search` | JWT | — | Buscar academias por nome |
| `GET` | `/gyms/nearby` | JWT | — | Academias em até 10 km |

### Check-ins

| Método | Rota | Auth | Role | Descrição |
|--------|------|------|------|-----------|
| `POST` | `/gyms/:gymId/check-ins` | JWT | — | Realizar check-in |
| `PATCH` | `/check-ins/:checkInId/validate` | JWT | ADMIN | Validar check-in |
| `GET` | `/check-ins/history` | JWT | — | Histórico paginado |
| `GET` | `/check-ins/metrics` | JWT | — | Total de check-ins |

> **Token de acesso** expira em **10 minutos**. O refresh token é armazenado em cookie `HttpOnly` e renova o acesso transparentemente.

---

## Modelos de Dados

```prisma
model User {
  id            String    @id @default(uuid())
  name          String
  email         String    @unique
  password_hash String
  role          Role      @default(MEMBER)  // ADMIN | MEMBER
  created_at    DateTime  @default(now())
  checkIns      CheckIn[]
}

model Gym {
  id          String    @id @default(uuid())
  title       String
  description String?
  phone       String?
  latitude    Decimal
  longitude   Decimal
  checkIns    CheckIn[]
}

model CheckIn {
  id           String    @id @default(uuid())
  created_at   DateTime  @default(now())
  validated_at DateTime?             // nulo até validação pelo ADMIN
  user_id      String
  gym_id       String
}
```

---

## Stack Tecnológica

### Runtime & Framework
- **Node.js 22** — runtime LTS
- **Fastify 5** — framework HTTP de alta performance com suporte nativo a TypeScript
- **TypeScript 6** — tipagem estrita com `noUncheckedIndexedAccess` e `exactOptionalPropertyTypes`

### Banco de Dados & ORM
- **PostgreSQL 16** — banco relacional robusto com suporte a tipos geográficos via `Decimal`
- **Prisma 7** — ORM type-safe com migrations automatizadas e client gerado em `src/generated/prisma`
- **`@prisma/adapter-pg`** — adaptador de driver para pg nativo

### Validação & Segurança
- **Zod 4** — validação de schemas em runtime com inferência de tipos
- **`fastify-type-provider-zod`** — integração de Zod como validator/serializer do Fastify
- **`@fastify/jwt`** — autenticação JWT com suporte a cookie
- **`@fastify/cookie`** — gerenciamento de cookies para refresh token
- **bcryptjs** — hash seguro de senhas

### Utilitários
- **dayjs** — manipulação de datas para lógica de validação de check-in
- **dotenv** — gerenciamento de variáveis de ambiente
- **pino-pretty** — logs coloridos em desenvolvimento

### Testes
- **Vitest 4** — framework de testes com projetos separados (`unit` e `e2e`)
- **Supertest** — testes de integração HTTP sem levantar servidor real
- **`vitest-environment-prisma`** — ambiente customizado que cria um schema isolado por suíte E2E

### Tooling
- **pnpm 10** — gerenciador de pacotes eficiente
- **tsup** — bundler baseado em esbuild para build de produção ESM
- **tsx** — executor TypeScript para desenvolvimento com hot reload
- **ESLint 10 + Prettier** — análise estática e formatação consistente
- **Docker Compose** — PostgreSQL + pgAdmin containerizados

---

## Como Executar

### Pré-requisitos

- Node.js 22+
- pnpm 10+
- Docker e Docker Compose

### 1. Clone o repositório

```bash
git clone https://github.com/Cardosofiles/apirest-solid-course.git
cd apirest-solid-course
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
# Edite o .env conforme necessário
```

### 4. Suba o banco de dados

```bash
docker compose up -d
```

### 5. Execute as migrations

```bash
pnpm db:migrate
```

### 6. Inicie o servidor em modo desenvolvimento

```bash
pnpm dev
```

O servidor estará disponível em `http://localhost:3333`.

### Comandos úteis

```bash
pnpm db:studio       # Abrir Prisma Studio (GUI do banco)
pnpm build           # Build de produção (ESM via tsup)
pnpm start           # Iniciar build de produção
```

---

## Testes

A suíte de testes é dividida em dois projetos independentes:

### Testes Unitários — Use Cases isolados

Repositórios in-memory substituem Prisma, garantindo velocidade e isolamento total.

```bash
pnpm test             # Execução única
pnpm test:watch       # Modo watch
pnpm test:coverage    # Com relatório de cobertura
pnpm test:ui          # Interface gráfica do Vitest
```

### Testes E2E — HTTP real + banco de dados real

Cada suíte recebe um schema PostgreSQL isolado (criado e destruído automaticamente pelo `vitest-environment-prisma`). Não há mocks — a requisição percorre toda a stack.

```bash
pnpm test:e2e         # Execução única
pnpm test:watch:e2e   # Modo watch
```

### Cobertura de testes

| Camada | Abordagem |
|--------|-----------|
| Use Cases | Unitário com in-memory repositories |
| Controllers HTTP | E2E com Supertest + Prisma + PostgreSQL real |
| Middlewares | Cobertos pelos testes E2E |

---

## CI/CD

Dois workflows no GitHub Actions:

| Workflow | Gatilho | O que executa |
|----------|---------|---------------|
| `run-unit-tests.yml` | Push em qualquer branch | `pnpm test` (testes unitários) |
| `run-e2e-tests.yml` | Pull Request | `pnpm test:e2e` com PostgreSQL via `bitnami/postgresql` service |

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz com base no `.env.example`:

```env
# Banco de dados
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gympass_style_db?schema=public"
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=gympass_style_db
POSTGRES_PORT=5432

# pgAdmin
PGADMIN_EMAIL=admin@admin.com
PGADMIN_PASSWORD=admin
PGADMIN_PORT=5050

# Aplicação
NODE_ENV=development
PORT=3333
JWT_SECRET=sua-chave-secreta-aqui
```

> `JWT_SECRET` deve ser uma string longa e aleatória em produção. O access token expira em **10 minutos**; o refresh token não possui prazo definido pelo servidor, mas deve ser rotacionado a cada uso.

---

## Autor

<div align="center">

<img src="https://github.com/Cardosofiles.png" width="96" style="border-radius: 50%" alt="Joao Batista Cardoso Miranda" />

**Joao Batista Cardoso Miranda**

[![GitHub](https://img.shields.io/badge/GitHub-Cardosofiles-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Cardosofiles)
[![Gmail](https://img.shields.io/badge/Gmail-cardosofiles%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:cardosofiles@gmail.com)

</div>

---

<div align="center">

Desenvolvido com foco em qualidade, arquitetura e boas práticas de engenharia de software.

</div>
