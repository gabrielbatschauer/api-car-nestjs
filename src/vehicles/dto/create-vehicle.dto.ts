import { ApiProperty } from '@nestjs/swagger';
import { CreateImageDto } from './create-image.dto';

export class CreateVehicleDto {
  @ApiProperty({
    example: 'Toyota',
    description: 'Marca do veículo',
  })
  brand!: string;

  @ApiProperty({
    example: 'Corolla',
    description: 'Modelo do veículo',
  })
  model!: string;

  @ApiProperty({
    example: 2020,
    description: 'Ano de fabricação do veículo',
  })
  year!: number;

  @ApiProperty({
    example: 70000,
    description: 'Preço do veículo em reais',
  })
  price!: number;

  @ApiProperty({
    example: 'Carro seminovo em ótimo estado',
    description: 'Descrição opcional do veículo',
    required: false,
  })
  description?: string;

  @ApiProperty({
    type: [CreateImageDto],
    description: 'Lista de imagens do veículo (opcional)',
    required: false,
  })
  images?: CreateImageDto[];
}
