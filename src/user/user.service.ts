import { Injectable, NotFoundException } from '@nestjs/common'
import { hash } from 'argon2'
import { PrismaService } from 'src/prisma.service'
import { CreateUserDto, UpdateUserDto } from 'src/user/dto/create-user.dto'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) throw new NotFoundException('Пользователь не найден')

    return user
  }

  async findByEmail(email: string) {
    const resultEmail = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!resultEmail)
      throw new NotFoundException('Пользователь с таким email не найден')

    return resultEmail
  }

  async create({ password, ...dto }: CreateUserDto) {
    const user = {
      ...dto,
      password: await hash(password),
    }

    return this.prisma.user.create({
      data: user,
    })
  }

  async update(id: number, { password, ...data }: UpdateUserDto) {
    await this.findById(id)

    const hashedPassword = password ? { password: await hash(password) } : {}

    return this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        ...hashedPassword,
      },
    })
  }
}
