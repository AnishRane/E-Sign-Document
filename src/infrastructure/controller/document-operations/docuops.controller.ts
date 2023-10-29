import {
  Controller,
  Get,
  UseInterceptors,
  Post,
  UploadedFiles,
  Body,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EnvironmentConfigService } from 'src/infrastructure/config';
import { ZohoOauthTokenService } from 'src/infrastructure/integrations/zoho';
import { TokenInterceptor } from 'src/infrastructure/common/interceptors';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { DocumentOpsService } from 'src/infrastructure/services/documentOps/documentOps.service';
import { DocuOperationsDto } from './docuops.dto';
@ApiTags('DocumentOps')
@Controller('document')
export class DocumentOperationsController {
  constructor(
    private readonly zohoOauthTokenService: ZohoOauthTokenService,
    private readonly documentOpsService: DocumentOpsService,
  ) {}

  @Get('token')
  async testTokenGeneration() {
    return this.zohoOauthTokenService.generateToken();
  }

  @Get('tokenDetails')
  @UseInterceptors(TokenInterceptor)
  async getTokenDetails() {
    return this.zohoOauthTokenService.getAccessToken();
  }

  @ApiResponse({ status: 500, description: 'Internal error' })
  @ApiResponse({ status: 201, description: 'success' })
  @Post('sendSignRequest')
  @UseInterceptors(
    TokenInterceptor,
    FileFieldsInterceptor([{ name: 'documents', maxCount: 1 }]), // Max count is set to 10 , as per zoho documentation it can only process 10 files in one document request
  )
  async initiateSignRequest(
    @UploadedFiles() files,
    @Body() body: DocuOperationsDto,
  ) {
    const zohoToken = this.zohoOauthTokenService.getAccessToken();
    const recipients = JSON.parse(body.recipients);
    const result = this.documentOpsService.createAndSubmitDocument(
      recipients,
      files,
      zohoToken.accesstoken,
    );
    if (result) {
      return { message: 'Success' };
    } else {
      return { message: 'Error' };
    }
  }

  // Just for testing purpose
  @Post('testWebhook')
  async zohoSignWebhook(@Body() body) {
    console.log('Body: ', body);
  }
}
