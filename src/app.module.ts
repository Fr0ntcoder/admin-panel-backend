import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './user/user.module';
import { SettingsModule } from './settings/settings.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, SettingsModule, StatisticsModule],
})
export class AppModule {}
