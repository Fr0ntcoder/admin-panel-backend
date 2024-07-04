import { UseGuards, applyDecorators } from '@nestjs/common'
import { Role } from '@prisma/client'
import { OnlyAdminGuard } from 'src/auth/guards/admin.guard'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'

export const Auth = (role: Role = Role.USER) => {
  if (role === Role.ADMIN) {
    return applyDecorators(UseGuards(JwtAuthGuard, OnlyAdminGuard))
  }

  return applyDecorators(UseGuards(JwtAuthGuard))
}
