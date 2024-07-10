/* export const getMailerConfig = async (
  configService: ConfigService,
): Promise<MailerOptions> => ({
  transport: {
    host: configService.get('SMTP_SERVER'),
    //port: isDev(configService) ? 587 : 465,
    //secure: !isDev(configService),
    port: 25,
    secure: false,
    auth: {
      user: configService.get('SMTP_LOGIN'),
      pass: configService.get('SMTP_PASSWORD'),
    },
  },
  defaults: {
    from: '"htmllessons" <jambox228@gmail.com>',
  },
}) */
