import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
  UsePipes,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { CreateVehicleSchema } from './schema/create-vehicle.schema';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth('jwt')
@Controller('vehicles')
@UseGuards(JwtAuthGuard)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @UsePipes(new ZodValidationPipe(CreateVehicleSchema))
  @Post()
  @ApiOperation({
    summary:
      'Criação de um veículo relacionando ID do usuário e ID das imagens',
  })
  @ApiResponse({
    status: 201,
    description: 'Veículo inserido no banco de dados',
    content: {
      'application/json': {
        examples: {
          CarroCriado: {
            summary: 'Dados do carro',
            value: {
              id: 1,
              brand: 'Toyota',
              model: 'Corolla',
              year: 1980,
              price: 70000,
              description: 'Carro seminovo em ótimo estado',
              userId: 1,
              images: [
                {
                  id: 1,
                  name: 'Foto frontal do carro',
                  url: 'https://meusite.com/imagem1.jpg',
                  vehicleId: 7,
                },
              ],
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
  @ApiResponse({
    status: 400,
    description: 'Erros de validação nos campos de criação de veículo',
    content: {
      'application/json': {
        examples: {
          MarcaObrigatoria: {
            summary: 'Marca não informada',
            value: {
              statusCode: 400,
              error: 'Bad Request',
              details: { message: 'Marca obrigatória' },
            },
          },
          ModeloObrigatorio: {
            summary: 'Modelo não informado',
            value: {
              statusCode: 400,
              error: 'Bad Request',
              details: { message: 'Modelo obrigatório' },
            },
          },
          AnoInvalido: {
            summary: 'Ano com menos de 4 dígitos',
            value: {
              statusCode: 400,
              error: 'Bad Request',
              details: { message: 'Ano deve ter exatamente 4 dígitos' },
            },
          },
          PrecoObrigatorio: {
            summary: 'Preço não informado ou zero',
            value: {
              statusCode: 400,
              error: 'Bad Request',
              details: { message: 'Valor obrigatório' },
            },
          },
          ImagemInvalida: {
            summary: 'Uma ou mais imagens estão com dados inválidos',
            value: {
              statusCode: 400,
              error: 'Bad Request',
              details: {
                message:
                  'Erro na validação de imagem: campo obrigatório ausente',
              },
            },
          },
          VariosErros: {
            summary: 'Múltiplos campos inválidos',
            value: {
              statusCode: 400,
              error: 'Bad Request',
              details: {
                message: [
                  'Marca obrigatória',
                  'Ano deve ter exatamente 4 dígitos',
                  'Valor obrigatório',
                ],
              },
            },
          },
        },
      },
    },
  })
  async create(@Request() req, @Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(req.user.id, createVehicleDto);
  }

  @Get()
  async findAll(@Request() req) {
    return this.vehiclesService.findAllByOwner(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.vehiclesService.findOneByOwner(id, req.user.id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() updateVehicleDto: Partial<CreateVehicleDto>,
  ) {
    return this.vehiclesService.update(id, req.user.id, updateVehicleDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.vehiclesService.remove(id, req.user.id);
  }
}
