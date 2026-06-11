import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateDoctorInput } from './dto/create-doctor.input';
import { UpdateDoctorInput } from './dto/update-doctor.input';
import { Doctor } from './models/doctor.model';
import { DoctorList } from './models/doctor-list.model';

@Injectable()
export class DoctorService {
  constructor(private prisma: PrismaService) {}

  async createDoctor(data: CreateDoctorInput): Promise<Doctor> {
    return this.prisma.doctor.create({
      data: {
        name: data.name,
      },
    });
  }

  async doctor(id: string): Promise<Doctor> {
    const existingDoctor = await this.prisma.doctor.findUnique({
      where: { id },
    });

    if (!existingDoctor) {
      throw new NotFoundException(`Doctor with id ${id} not found`);
    }

    return existingDoctor;
  }

  async doctors(skip: number = 0, take: number = 10): Promise<DoctorList> {
    const total = await this.prisma.doctor.count();

    const data = await this.prisma.doctor.findMany({
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      data,
      total,
      skip,
      take,
    };
  }

  async updateDoctor(id: string, data: UpdateDoctorInput): Promise<Doctor> {
    const existingDoctor = await this.prisma.doctor.findUnique({
      where: { id },
    });

    if (!existingDoctor) {
      throw new NotFoundException(`Doctor with id ${id} not found`);
    }

    return this.prisma.doctor.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
      },
    });
  }

  async deleteDoctor(id: string): Promise<boolean> {
    const existingDoctor = await this.prisma.doctor.findUnique({
      where: { id },
    });

    if (!existingDoctor) {
      throw new NotFoundException(`Doctor with id ${id} not found`);
    }

    await this.prisma.doctor.delete({
      where: { id },
    });

    return true;
  }
}
