import { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'
import { isDev } from 'src/utils/is-dev.util'

export const getMailerConfig = async (
  configService: ConfigService,
): Promise<MailerOptions> => ({
  transport: {
    host: configService.get('SMPT_SERVER'),
    port: isDev(configService) ? 587 : 465,
    secure: !isDev(configService),
    auth: {
      user: configService.get('SMPT_LOGIN'),
      pass: configService.get('SMPT_PASSWORD'),
    },
  },
  defaults: {
    from: '"frontcoder" <jambox228@gmail.com>',
  },
})