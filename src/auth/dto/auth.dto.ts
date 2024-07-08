import { IsEmail, IsString, MinLength } from 'class-validator'

export class AuthDto {
  @IsEmail()
  email: string

  @MinLength(6, {
    message: 'Ваш пароль должен иметь не менее 6 символов',
  })
  @IsString()
  password: string
}
