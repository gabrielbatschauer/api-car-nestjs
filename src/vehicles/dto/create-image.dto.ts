import { ApiProperty } from '@nestjs/swagger';

export class CreateImageDto {
  @ApiProperty({
    example: 'Foto frontal do carro',
    description: 'Descrição para a imagem do veículo',
  })
  name!: string;

  @ApiProperty({
    example: 'https://meusite.com/imagem1.jpg',
    description: 'URL da imagem do veículo',
  })
  url!: string;
}
