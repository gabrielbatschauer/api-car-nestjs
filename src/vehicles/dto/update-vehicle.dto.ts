import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateVehicleDto } from './create-vehicle.dto';
import { CreateImageDto } from './create-image.dto';

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {
  @ApiProperty({
    type: [CreateImageDto],
    description:
      'Lista de imagens do veículo (opcional). ' +
      'Se fornecida, substituirá todas as imagens existentes. ' +
      'Se omitida, as imagens existentes serão mantidas. ' +
      'Se enviada como array vazio ([]), todas as imagens serão removidas.',
    required: false,
  })
  images?: CreateImageDto[];
}
