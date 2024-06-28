import { CanActivate } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

export class OnlyAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
}
