import { Module } from '@nestjs/common';
import { DoctorService } from './doctors.service';
import { DoctorResolver } from './doctors.resolver';

@Module({
  providers: [DoctorService, DoctorResolver],
  exports: [DoctorService],
})
export class DoctorsModule {}
