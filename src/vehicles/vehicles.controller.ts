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
  Query,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { CreateVehicleSchema } from './schema/create-vehicle.schema';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { UpdateVehicleSchema } from './schema/update-vehicle.schema';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { FilterVehiclesDto } from './schema/filter-vehicle.schema';

@ApiBearerAuth('jwt')
@Controller('vehicles')
@UseGuards(JwtAuthGuard)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @ApiOperation({
    summary:
      'Criação de um veículo relacionando ID do usuário e ID das imagens',
  })
  @ApiConsumes('application/json')
  @ApiBody({
    type: CreateVehicleDto,
    description:
      'Dados necessários para criar um veículo com imagens opcionais',
    examples: {
      CriarComImagens: {
        summary: 'Criar veículo com imagens',
        value: {
          brand: 'Toyota',
          model: 'Corolla',
          year: 1980,
          price: 70000,
          description: 'Carro seminovo em ótimo estado',
          images: [
            {
              name: 'Foto frontal do carro',
              url: 'https://meusite.com/imagem1.jpg',
            },
          ],
        },
      },
      CriarSemImagens: {
        summary: 'Criar veículo sem imagens',
        value: {
          brand: 'Ford',
          model: 'Fiesta',
          year: 2010,
          price: 30000,
          description: 'Carro usado, mas em bom estado',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Veículo inserido no banco de dados',
    content: {
      'application/json': {
        examples: {
          CarroCriado: {
            summary: 'Dados do carro criado',
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
  @ApiResponse({
    status: 401,
    description: 'Sem autorização para a rota',
    content: {
      'application/json': {
        examples: {
          Unauthorized: {
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
  @UsePipes(new ZodValidationPipe(CreateVehicleSchema))
  async create(@Body() createVehicleDto: CreateVehicleDto, @Request() req) {
    return this.vehiclesService.create(req.user.id, createVehicleDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar veículos do usuário com paginação e filtros',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de veículos do usuário',
    content: {
      'application/json': {
        example: [
          {
            id: 1,
            brand: 'Toyota',
            model: 'Corolla',
            year: 2020,
            price: 70000,
            description: 'Carro seminovo',
            images: [],
          },
        ],
      },
    },
  })
  @ApiExtraModels(FilterVehiclesDto)
  @ApiQuery({
    name: 'page',
    example: 1,
    required: false,
    description: 'Número da página de busca',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    example: 10,
    required: false,
    description: 'Quantidade de veículos retornados por página',
    type: Number,
  })
  @ApiQuery({
    name: 'brand',
    example: 'Toyota',
    required: false,
    description: 'Marca que deseja filtrar',
    type: String,
  })
  @ApiQuery({
    name: 'model',
    example: 'Camry',
    required: false,
    description: 'Modelo do carro para filtrar',
    type: String,
  })
  @ApiQuery({
    name: 'year',
    example: 2020,
    required: false,
    description: 'Ano que deseja filtrar',
    type: Number,
  })
  async findAll(@Request() req, @Query() query: FilterVehiclesDto) {
    const { page, limit, brand, model, year } = query;

    const parsedPage = page ? parseInt(page, 10) : 1;
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    const parsedYear = year ? parseInt(year, 10) : undefined;
    return this.vehiclesService.findAllByOwner(
      req.user.id,
      parsedPage,
      parsedLimit,
      brand,
      model,
      parsedYear,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar veículo específico' })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'ID do veículo a ser buscado',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Dados do veículo',
    content: {
      'application/json': {
        example: {
          id: 1,
          brand: 'Toyota',
          model: 'Corolla',
          year: 2020,
          price: 70000,
          description: 'Carro seminovo',
          images: [],
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Veículo não encontrado',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          error: 'Not Found',
          message: 'Veículo não encontrado',
        },
      },
    },
  })
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.vehiclesService.findOneByOwner(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar veículo' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do veículo que será atualizado',
    example: 1,
  })
  @ApiConsumes('application/json')
  @ApiBody({
    type: UpdateVehicleDto,
    description:
      'Atualiza um veículo. Se o campo "images" for enviado, ele substituirá todas as imagens existentes. ' +
      'Se omitido, as imagens atuais serão mantidas. Se enviado como array vazio, todas as imagens serão removidas.',
    examples: {
      AtualizarComImagens: {
        summary: 'Atualizar veículo com novas imagens',
        value: {
          brand: 'Toyota',
          images: [
            { name: 'Frontal', url: 'https://site.com/img1.jpg' },
            { name: 'Lateral', url: 'https://site.com/img2.jpg' },
          ],
        },
      },
      AtualizarSemAlterarImagens: {
        summary: 'Atualizar veículo sem mexer nas imagens',
        value: {
          brand: 'Toyota',
          model: 'Corolla',
        },
      },
      AtualizarRemovendoImagens: {
        summary: 'Atualizar veículo removendo todas as imagens',
        value: {
          brand: 'Toyota',
          images: [],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Veículo atualizado com sucesso',
    content: {
      'application/json': {
        example: {
          id: 1,
          brand: 'Toyota',
          model: 'Corolla',
          year: 2020,
          price: 70000,
          description: 'Carro seminovo em ótimo estado',
          images: [
            { id: 1, name: 'Frontal', url: 'https://site.com/img1.jpg' },
            { id: 2, name: 'Lateral', url: 'https://site.com/img2.jpg' },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados de entrada inválidos',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          error: 'Bad Request',
          details: [
            {
              path: 'brand',
              message: 'Marca obrigatória',
              code: 'invalid_type',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Veículo não encontrado',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          error: 'Not Found',
          message: 'Veículo não encontrado',
        },
      },
    },
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body(new ZodValidationPipe(UpdateVehicleSchema)) updateVehicleDto: any,
  ) {
    return this.vehiclesService.update(id, req.user.id, updateVehicleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar veículo' })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'ID do veículo que será deletado',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Veículo deletado com sucesso',
    content: {
      'application/json': {
        example: {
          message: 'Veículo Toyota Corolla deletado com sucesso',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Veículo não encontrado',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          error: 'Not Found',
          message: 'Veículo não encontrado',
        },
      },
    },
  })
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.vehiclesService.remove(id, req.user.id);
  }
}
