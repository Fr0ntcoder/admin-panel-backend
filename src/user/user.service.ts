import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findById(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    })

    if (!user) throw new NotFoundException('Пользователь не найден')

    return user
  }

  async findByEmail(email: string) {
    const resultEmail = await this.prismaService.user.findUnique({
      where: { email },
    })

    if (!resultEmail)
      throw new NotFoundException('Пользователь с таким email не найден')

    return resultEmail
  }
}
