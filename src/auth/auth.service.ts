import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Role } from '@prisma/client'
import { verify } from 'argon2'
import { Response } from 'express'
import { AuthDto } from 'src/auth/dto/auth.dto'
import { EmailService } from 'src/email/email.service'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'

@Injectable()
export class AuthService {
  EXPIRE_DAY_REFRESH_TOKEN = 1
  REFRESH_TOKEN_NAME = 'refreshToken'

  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwt: JwtService,
    private emailService: EmailService,
  ) {}

  async login(dto: AuthDto) {
    const { password, ...user } = await this.validateUser(dto)

    const tokens = await this.issueTokens(user.id, user.role)

    return { user, ...tokens }
  }

  async register(dto: AuthDto) {
    const oldUser = await this.userService.findByEmail(dto.email)

    if (oldUser) {
      throw new BadRequestException('Этот пользователь уже существует')
    }

    const { password, ...user } = await this.userService.create(dto)

    const tokens = await this.issueTokens(user.id, user.role)

    await this.emailService.sendWelcome(user.email)

    return { user, ...tokens }
  }

  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken)
    if (!result) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    const { password, ...user } = await this.userService.findById(result.id)

    const tokens = await this.issueTokens(user.id, user.role)

    return { user, ...tokens }
  }

  private async issueTokens(userId: number, role?: Role) {
    const data = { id: userId, role }

    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    })

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
    })

    return { accessToken, refreshToken }
  }

  private async validateUser(dto: AuthDto) {
    const user = await this.userService.findByEmail(dto.email)

    if (!user) {
      throw new UnauthorizedException('Неверный пароль')
    }

    const isValid = await verify(user.password, dto.password)

    if (isValid) {
      throw new UnauthorizedException('Неверный email')
    }

    return user
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expireIn = new Date()
    expireIn.setDate(expireIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: 'localhost',
      expires: expireIn,
      // true if production
      secure: true,
      // lax if production
      sameSite: 'none',
    })
  }

  removeRefreshTokenToResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, {
      httpOnly: true,
      domain: 'localhost',
      expires: new Date(0),
      // true if production
      secure: true,
      // lax if production
      sameSite: 'none',
    })
  }
}
