import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
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
