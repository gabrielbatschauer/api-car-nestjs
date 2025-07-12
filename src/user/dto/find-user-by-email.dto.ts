import { ApiProperty } from '@nestjs/swagger';

export class FindUserByEmailDto {
  @ApiProperty({
    example: 'usuario@email.com',
    description: 'E-mail completo do usuário',
  })
  email!: string;
}
