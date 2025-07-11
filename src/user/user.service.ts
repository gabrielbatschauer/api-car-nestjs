import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from 'generated/prisma';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

@IsPublic()
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const data: Prisma.UserCreateInput = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    };

    try {
      const createdUser = await this.prisma.user.create({ data });
      return {
        ...createdUser,
        password: undefined!,
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('E-mail já cadastrado');
      }

      throw new InternalServerErrorException('Erro ao criar usuário');
    }
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
