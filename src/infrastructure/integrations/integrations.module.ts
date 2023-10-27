import { Module } from '@nestjs/common';
import { ZohoOauthTokenService } from './zoho';
import { HttpService } from '@nestjs/axios';

@Module({
  providers: [ZohoOauthTokenService, HttpService],
  exports: [ZohoOauthTokenService, HttpService],
})
export class IntegrationsModule {}
