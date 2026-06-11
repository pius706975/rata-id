import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DoctorService } from './doctors.service';
import { Doctor } from './models/doctor.model';
import { DoctorList } from './models/doctor-list.model';
import { CreateDoctorInput } from './dto/create-doctor.input';
import { UpdateDoctorInput } from './dto/update-doctor.input';
import { DoctorPaginationArgs } from './dto/doctor-pagination.args';
import { HttpBearerGuard } from '../common/guards/http-bearer.guard';

@Resolver(() => Doctor)
@UseGuards(HttpBearerGuard)
export class DoctorResolver {
  constructor(private readonly doctorService: DoctorService) {}

  @Mutation(() => Doctor, { description: 'Create a new doctor' })
  async createDoctor(@Args('data') data: CreateDoctorInput): Promise<Doctor> {
    return this.doctorService.createDoctor(data);
  }

  @Query(() => Doctor, { description: 'Get doctor by ID' })
  async doctor(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Doctor> {
    return this.doctorService.doctor(id);
  }

  @Query(() => DoctorList, {
    description: 'Get all doctors with pagination (offset-based)',
  })
  async doctors(@Args() args: DoctorPaginationArgs): Promise<DoctorList> {
    return this.doctorService.doctors(args.skip || 0, args.take || 10);
  }

  @Mutation(() => Doctor, { description: 'Update doctor' })
  async updateDoctor(
    @Args('id', { type: () => String }) id: string,
    @Args('data') data: UpdateDoctorInput,
  ): Promise<Doctor> {
    return this.doctorService.updateDoctor(id, data);
  }

  @Mutation(() => Boolean, { description: 'Delete doctor' })
  async deleteDoctor(
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    return this.doctorService.deleteDoctor(id);
  }
}
