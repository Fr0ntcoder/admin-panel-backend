import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { getMailerConfig } from 'src/config/mail.config'
import { EmailService } from './email.service'

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getMailerConfig,
      inject: [ConfigService],
    }),
  ],
  exports: [EmailService],
  providers: [EmailService],
})
export class EmailModule {}
