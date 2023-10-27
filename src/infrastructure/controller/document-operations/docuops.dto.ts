import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString, IsArray } from 'class-validator';

export class DocuOperationsDto {
  @ApiProperty({ type: 'string', required: true })
  @IsNotEmpty()
  recipients: string;
}
