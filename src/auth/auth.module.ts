import { Module } from '@nestjs/common'
import { AuthController } from 'src/auth/auth.controller'
import { AuthService } from 'src/auth/auth.service'
import { JwtStrategy } from 'src/auth/jwt.strategy'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, UserService, JwtStrategy],
})
export class AuthModule {}
