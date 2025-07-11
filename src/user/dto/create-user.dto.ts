// Utilizado pelo Swagger para documentar a criação de usuários e para validação dos dados de entrada

import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'Usuário',
    description: 'Nome completo do usuário',
  })
  name!: string;

  @ApiProperty({
    example: 'usuario@email.com',
    description: 'E-mail válido para login',
  })
  email!: string;

  @ApiProperty({
    example: 'senha123',
    description: 'Senha com no mínimo 6 caracteres',
  })
  password!: string;
}
