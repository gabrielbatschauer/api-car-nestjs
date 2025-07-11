import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, data: CreateVehicleDto) {
    return this.prisma.vehicle.create({
      data: {
        brand: data.brand,
        model: data.model,
        year: data.year,
        price: data.price,
        description: data.description ?? '',
        userId: userId,
        images: {
          create:
            data.images?.map((img) => ({
              name: img.name,
              url: img.url,
            })) ?? [],
        },
      },
      include: {
        images: true,
      },
    });
  }

  async findAllByOwner(userId: number) {
    return this.prisma.vehicle.findMany({
      where: { userId: userId },
      include: { images: true },
    });
  }

  async findOneByOwner(id: number, userId: number) {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id, userId: userId },
      include: { images: true },
    });

    if (!vehicle) {
      throw new NotFoundException('Veículo não encontrado');
    }

    return vehicle;
  }

  async update(id: number, userId: number, data: UpdateVehicleDto) {
    const vehicle = await this.findOneByOwner(id, userId);

    return this.prisma.$transaction(async (tx) => {
      // Atualiza campos básicos do veículo
      const updatedVehicle = await tx.vehicle.update({
        where: { id },
        data: {
          brand: data.brand ?? vehicle.brand,
          model: data.model ?? vehicle.model,
          year: data.year ?? vehicle.year,
          price: data.price ?? vehicle.price,
          description: data.description ?? vehicle.description,
        },
      });

      // Atualiza imagens somente se data.images EXISTIR (undefined = não mexe)
      if (data.images !== undefined) {
        // Apaga as imagens antigas
        await tx.image.deleteMany({
          where: { vehicleId: id },
        });

        // Cria as novas imagens (se tiver alguma)
        if (data.images.length > 0) {
          await tx.image.createMany({
            data: data.images.map((img) => ({
              name: img.name,
              url: img.url,
              vehicleId: id,
            })),
          });
        }
      }

      // Retorna o veículo atualizado com imagens
      return tx.vehicle.findUnique({
        where: { id },
        include: { images: true },
      });
    });
  }

  async remove(id: number, userId: number) {
    await this.findOneByOwner(id, userId);

    return this.prisma.vehicle.delete({ where: { id } });
  }
}
