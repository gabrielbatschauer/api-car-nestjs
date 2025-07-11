# API de Gestão de Estoque Veicular

API RESTful construída com NestJS, Prisma e MySQL, com autenticação JWT e validações com Zod. Permite que lojistas cadastrem, editem e removam veículos de seu estoque de forma segura e autenticada.

<br />

## Funcionalidades
<ul>
  <li>Cadastro e login com JWT</li>
  <li>CRUD de veículos com validação</li>
  <li>Upload e vínculo de imagens aos veículos</li>
  <li>Swagger com exemplos de requisições e erros</li>
  <li>Proteção de rotas com JWT (Guards)</li>
  <li>Multiusuário: cada lojista vê apenas seus próprios veículos</li>
</ul>

<br />

## Tecnologias

<div align="center">
  <img src="https://img.shields.io/badge/-Nest.js-0D1117?style=for-the-badge&logo=nestjs&labelColor=0D1117" />
  <img src="https://img.shields.io/badge/-Prisma-0D1117?style=for-the-badge&logo=prisma&labelColor=0D1117" />
  <img src="https://img.shields.io/badge/-MySQL-0D1117?style=for-the-badge&logo=mysql&labelColor=0D1117" />
  <img src="https://img.shields.io/badge/-Zod-0D1117?style=for-the-badge&logo=zod&labelColor=0D1117" />
  <img src="https://img.shields.io/badge/-JWT-0D1117?style=for-the-badge&logo=jwt&labelColor=0D1117" />
  <img src="https://img.shields.io/badge/-Swagger-0D1117?style=for-the-badge&logo=swagger&labelColor=0D1117" />
</div>

<br />

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

### 3. Crie o arquivo `.env` com suas credenciais

Copie o arquivo de exemplo
```bash
cp .env.example .env
```
Modifique seu .env com suas credenciais e sua chave JWT (Chave aleatória)
```bash
JWT_SECRET="senha_segura"

DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"
```

### 4. Iniciando o Prisma

```bash
npx prisma migrate dev --name init
```

### 5. Rode a aplicação em modo dev

```bash
npm run start:dev
```

<br />

## Documentação da API via Swagger

Acesse em http://localhost:3000/api
