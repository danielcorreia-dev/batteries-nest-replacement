import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  // async create(createUserDto: CreateUserDto) {
  //   try {
  //     const { username, email, password } = createUserDto;
  //     const hashPassword = await bcrypt.hash(password, 10);

  //     const user = await this.prismaService.user.create({
  //       data: {
  //         email: email,
  //         name: username,
  //         username: username,
  //         password: hashPassword,
  //       },
  //     });

  //     const { password: _, ...result } = user;
  //     return result;
  //   } catch (error) {
  //     if (error.code === 'P2002') {
  //       throw new NotFoundException('User already exists');
  //     }
  //   }
  // }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number): Promise<User> {
    try {
      return await this.prismaService.user.findUniqueOrThrow({
        where: {
          id,
        },
      });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
    }
  }

  async findOneUserWithEmailOrUsername(userInput: string) {
    try {
      return await this.prismaService.user.findFirst({
        where: { OR: [{ email: userInput }, { username: userInput }] },
      });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
