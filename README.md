## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# API de Gestão de Estoque Veicular

API RESTful construída com NestJS, Prisma e MySQL, com autenticação JWT e validações com Zod. Permite que lojistas cadastrem, editem e removam veículos de seu estoque de forma segura e autenticada.

---

## Funcionalidades

Cadastro e login com JWT

CRUD de veículos com validação

Upload e vínculo de imagens aos veículos

Swagger com exemplos de requisições e erros

Proteção de rotas com JWT (Guards)

Multiusuário: cada lojista vê apenas seus próprios veículos

---

## Tecnologias

- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [MySQL](https://www.mysql.com/)
- [Zod](https://zod.dev/)
- [JWT](https://jwt.io/)
- [Swagger](https://swagger.io/)

---

## Documentação

Acesse http://localhost:3000/api

---

## Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/gabrielbatschauer/api-car-nestjs
cd api-car-nestjs
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Clone o .env.example e configure o banco de dados e a senha secreta

```bash
cp .env.example .env
```

### 4. Iniciando o Prisma

```bash
cp .env.example .env
```

### 5. Rode a aplicação em modo dev

```bash
npm run start:dev
```
