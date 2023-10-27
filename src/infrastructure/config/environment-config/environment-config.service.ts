import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentConfigService {
  constructor(private configService: ConfigService) {}

  getZohoRefereshToken() {
    return this.configService.get<string>('ZOHO_REFRESH_TOKEN');
  }

  getZohoClientId() {
    return this.configService.get<string>('ZOHO_CLIENT_ID');
  }

  getZohoClientSecret() {
    return this.configService.get<string>('ZOHO_CLIENT_SECRET');
  }

  getZohoOauthUrl() {
    return this.configService.get<string>('ZOHO_OAUTH_TOKEN_API');
  }
}
