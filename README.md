# Daily Diet API

API REST para cadastro de usuários e gerenciamento de refeições, com acompanhamento de refeições dentro e fora da dieta. A aplicação usa Fastify, TypeScript, Prisma ORM 7 e PostgreSQL.

## Requisitos

- Node.js e npm
- Docker com Docker Compose (ou uma instância PostgreSQL acessível)

## Configuração local

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Inicie o PostgreSQL local fornecido pelo projeto:

   ```bash
   docker compose up -d
   ```

   O serviço publica o banco `diet` na porta `5432`, com usuário e senha `docker`.

3. Crie um arquivo `.env` na raiz do projeto:

   ```env
   NODE_ENV=dev
   PORT=3333
   DATABASE_URL="postgresql://docker:docker@localhost:5432/diet?schema=public"
   JWT_SECRET="troque-por-um-segredo-local"
   ```

   `NODE_ENV` aceita `dev`, `test` ou `production`; `PORT` é opcional e assume `3333`. `DATABASE_URL` e `JWT_SECRET` são obrigatórios.

4. Gere o Prisma Client e aplique as migrações:

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. Inicie a API em modo de desenvolvimento:

   ```bash
   npm run dev
   ```

O servidor escuta em `http://localhost:3333` (ou na porta definida em `PORT`).

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor com recarga durante o desenvolvimento. |
| `npm run build` | Compila a aplicação para `build/`. |
| `npm start` | Inicia a aplicação compilada em `build/server.js`. |
| `npm run test:e2e` | Executa os testes end-to-end do Vitest. |

Para executar a versão compilada, configure as variáveis de ambiente e rode `npm run build` seguido de `npm start`.

## API

Todas as rotas estão na raiz, sem prefixo `/api`. As rotas protegidas exigem o token retornado pelo login no cabeçalho:

```http
Authorization: Bearer <token>
```

O token JWT expira em 10 minutos. As entradas são validadas com Zod; erros de validação retornam `400`. O limite configurado é de 100 requisições por janela de 15 minutos.

### Usuários

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| `POST` | `/register` | Público | Cadastra usuário. Corpo: `{ "name": "Ana", "email": "ana@example.com", "password": "senha" }`. Retorna `201`; e-mail já cadastrado retorna `409`. |
| `POST` | `/sessions` | Público | Autentica usuário. Corpo: `{ "email": "ana@example.com", "password": "senha" }`. Retorna `200` com `{ "token": "..." }`; credenciais inválidas retornam `401`. |
| `GET` | `/me` | JWT | Retorna os dados do usuário autenticado, sem o hash da senha. |

### Refeições

Os corpos de criação e atualização usam `title` (texto), `description` (texto), `isOnDiet` (booleano) e `date` (data/hora aceita por `Date`). Exemplo:

```json
{
  "title": "Almoço",
  "description": "Arroz, feijão e salada",
  "isOnDiet": true,
  "date": "2026-10-17T12:30:00.000Z"
}
```

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/create-meal` | Cria refeição para o usuário autenticado. Retorna `201` com `{ "meal": ... }`. |
| `GET` | `/meals` | Lista as refeições do usuário autenticado. Aceita `?isOnDiet=true` ou `?isOnDiet=false` como filtro opcional. Retorna `{ "meals": [...] }`. |
| `GET` | `/meals/metrics` | Retorna `{ "metrics": { "totalMeals", "mealsOnDiet", "mealsOffDiet", "percentageOnDiet" } }`. O percentual tem duas casas decimais; sem refeições, é `0`. |
| `GET` | `/meals/:mealId` | Busca uma refeição do usuário autenticado. |
| `PUT` | `/meals/:mealId` | Atualiza todos os campos da refeição informados no exemplo acima. |
| `DELETE` | `/meals/:mealId` | Exclui uma refeição e retorna `204` sem corpo. |

As rotas de refeições só acessam registros pertencentes ao usuário autenticado. IDs inválidos geram erro `400`; registro inexistente ou que não pertence ao usuário retorna `404`. Token ausente ou inválido retorna `401`.

### Exemplos com cURL

Cadastro e login:

```bash
curl -X POST http://localhost:3333/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ana","email":"ana@example.com","password":"senha"}'

curl -X POST http://localhost:3333/sessions \
  -H 'Content-Type: application/json' \
  -d '{"email":"ana@example.com","password":"senha"}'
```

Use o token recebido para criar e listar refeições:

```bash
curl -X POST http://localhost:3333/create-meal \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <token>' \
  -d '{"title":"Almoço","description":"Arroz e salada","isOnDiet":true,"date":"2026-10-17T12:30:00.000Z"}'

curl http://localhost:3333/meals \
  -H 'Authorization: Bearer <token>'
```

## Estrutura do projeto

- `src/http/controllers`: rotas e controladores Fastify, separados entre usuários e refeições.
- `src/http/middlewares`: autenticação JWT.
- `src/use-cases`: regras de negócio e fábricas dos casos de uso.
- `src/repositories`: contratos e implementação dos repositórios com Prisma.
- `src/lib/prisma.ts`: conexão Prisma com PostgreSQL via driver adapter `pg`.
- `prisma/schema.prisma` e `prisma/migrations`: modelos e migrações do banco.

O modelo de usuário armazena nome, e-mail único, hash da senha e estado ativo. Cada refeição pertence a um usuário e contém título, descrição, indicador de dieta e data.
