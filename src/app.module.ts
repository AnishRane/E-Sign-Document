import { Module } from '@nestjs/common';
import { EnvironmentConfigModule } from './infrastructure/config/environment-config/environment-config.module';
import { ControllersModule } from './infrastructure/controller/controller.module';

@Module({
  imports: [EnvironmentConfigModule, ControllersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
