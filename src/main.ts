import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestjsSwagger } from '@anatine/zod-nestjs';
import { ZodExceptionFilter } from './filters/zod-exception.filter';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ZodExceptionFilter());

  patchNestjsSwagger();
  const config = new DocumentBuilder()
    .setTitle('API Gestão de Estoque Veicular')
    .setDescription(
      'API com validação JWT para CRUD completo de estoque de carros',
    )
    .setDescription(
      `
Esta API permite que lojistas gerenciem seus estoques de veículos com segurança e autenticação via JWT.

### Como usar:

1. **Crie um usuário** com \`POST /user\`
2. **Faça login** com \`POST /login\` e receba o token JWT
3. **Clique em "Authorize" no Swagger** e cole o token fornecido pelo passo 2
4. Agora você pode acessar rotas protegidas como \`POST /vehicles\`, \`GET /vehicles\`, etc.

🔒 **Todas as rotas de veículos exigem autenticação.**
 **Cada usuário só acessa os veículos que ele criou.**

---
Rotas de **usuários** contém DTO e Schemas, utilizando os Schemas para validação com Zod e DTO para validar objetos, **possuindo Schema**.

Rotas de **veículos** contém apenas Schemas, exportando as mesmas com **'export class nomeDoDto extends createZodDto(NomeDoSchema)) {}'**, portando **não possuem Schemas** dentro do Swagger
`,
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'jwt',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(express.json());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
