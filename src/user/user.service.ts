import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { hash } from 'argon2'
import { isHasMorePagination } from 'src/base/pagination/is-has-more'
import { PaginationArgsWithSearchTerm } from 'src/base/pagination/pagination.args'
import { PrismaService } from 'src/prisma.service'
import { CreateUserDto, UpdateUserDto } from 'src/user/dto/create-user.dto'
import { UserResponse } from 'src/user/user.response'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private getSearchTermFilter(searchTerm: string): Prisma.UserWhereInput {
    return {
      OR: [
        {
          email: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          name: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          country: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
      ],
    }
  }
  async findAll(args?: PaginationArgsWithSearchTerm): Promise<UserResponse> {
    const skip = +args?.skip
    const take = +args?.take
    const searchTermQuery = args?.searchTerm
      ? this.getSearchTermFilter(args?.searchTerm)
      : {}

    const users = await this.prisma.user.findMany({
      skip: skip,
      take: take,
      where: searchTermQuery,
    })

    const totalCount = await this.prisma.user.count({ where: searchTermQuery })

    const isHasMore = isHasMorePagination(totalCount, skip, take)

    return { items: users, isHasMore }
  }
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

  async delete(id: string) {
    await this.findById(+id)

    return this.prisma.user.delete({
      where: {
        id: +id,
      },
    })
  }
}
