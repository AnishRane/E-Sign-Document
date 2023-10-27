import { Module } from '@nestjs/common';
import { DocumentOperationsController } from './document-operations';
import { EnvironmentConfigService } from '../config/environment-config/environment-config.service';
import { ZohoOauthTokenService } from '../integrations/zoho';
import { DocumentOpsService } from '../services/documentOps/documentOps.service';

@Module({
  providers: [
    EnvironmentConfigService,
    ZohoOauthTokenService,
    DocumentOpsService,
  ],
  controllers: [DocumentOperationsController],
})
export class ControllersModule {}
