import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './user/user.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, SettingsModule],
})
export class AppModule {}
