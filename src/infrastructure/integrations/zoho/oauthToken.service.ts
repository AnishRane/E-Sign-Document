import { Injectable } from '@nestjs/common';
import { EnvironmentConfigService } from 'src/infrastructure/config';
import axios from 'axios';

@Injectable()
export class ZohoOauthTokenService {
  constructor(
    private readonly environmentConfigService: EnvironmentConfigService,
  ) {}
  private accessToken: string;
  private refreshToken: string =
    this.environmentConfigService.getZohoRefereshToken();
  private clientId = this.environmentConfigService.getZohoClientId();
  private clientSecret = this.environmentConfigService.getZohoClientSecret();
  private expirationTime: number;

  async generateToken() {
    const queryParams = {
      refresh_token: this.refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'refresh_token',
    };
    try {
      const response = await axios.post(
        `${this.environmentConfigService.getZohoOauthUrl()}`,
        null,
        { params: queryParams },
      );
      this.accessToken = response.data.access_token;
      this.expirationTime =
        Math.round(Date.now() / 1000) + response.data.expires_in - 120;
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  getAccessToken() {
    return {
      accesstoken: this.accessToken,
      expiresOn: this.expirationTime,
    };
  }

  isTokenValid(): boolean {
    if (!this.accessToken || !this.expirationTime) {
      return false;
    }
    return Math.round(Date.now() / 1000) < this.expirationTime;
  }
}
