import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserSchema } from './schema/create-user.schema';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { FindUserByEmailDto } from './dto/find-user-by-email.dto';

@ApiTags('Usuário')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /////

  @IsPublic()
  @Post()
  @UsePipes(new ZodValidationPipe(CreateUserSchema))
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Erros de validação nos campos de criação de usuário',
    content: {
      'application/json': {
        examples: {
          NomeVazio: {
            summary: 'Nome não informado',
            value: {
              statusCode: 400,
              error: 'Bad Request',
              details: { message: 'Nome é obrigatório' },
            },
          },
          EmailInvalido: {
            summary: 'E-mail com formato inválido',
            value: {
              statusCode: 400,
              error: 'Bad Request',
              details: { message: 'E-mail inválido' },
            },
          },
          SenhaMuitoCurta: {
            summary: 'Senha menor que 6 caracteres',
            value: {
              statusCode: 400,
              error: 'Bad Request',
              details: { message: 'Senha mínima de 6 caracteres' },
            },
          },
          VariosCamposInvalidos: {
            summary: 'Múltiplos erros ao mesmo tempo',
            value: {
              statusCode: 400,
              error: 'Bad Request',
              details: {
                message: [
                  'Nome é obrigatório',
                  'E-mail inválido',
                  'Senha mínima de 6 caracteres',
                ],
              },
            },
          },
        },
      },
    },
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  //////

  @Post('find')
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: 'Acha o usuário pelo e-mail (usado para validação e login)',
  })
  @ApiResponse({
    status: 201,
    description: 'Retorna os dados do usuário',
    content: {
      'application/json': {
        examples: {
          Dados: {
            summary: 'Dados do usuário',
            value: {
              id: 1,
              email: 'usuario@gmail.com',
              password: 'Senha transformada em hash',
              name: 'usuario',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Sem autorização para a rota',
    content: {
      'application/json': {
        examples: {
          NomeVazio: {
            summary: 'Sem autorização',
            value: {
              message: 'Unauthorized',
              error: 'Unauthorized',
              statusCode: 401,
            },
          },
        },
      },
    },
  })
  @ApiBody({ type: FindUserByEmailDto })
  findByEmail(@Body('email') email: string) {
    return this.userService.findByEmail(email);
  }
}
