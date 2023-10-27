import { Module } from '@nestjs/common';
import { DocumentOpsService } from './documentOps.service';

@Module({
  providers: [DocumentOpsService],
  exports: [DocumentOpsService],
})
export class DocumentOpsModule {}
