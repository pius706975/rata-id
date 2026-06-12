import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateScheduleInput } from './dto/create-schedule.input';
import { Schedule } from './models/schedule.model';
import { ScheduleList } from './models/schedule-list';
import { ScheduleFilterArgs } from './dto/schedule-filter.args';
import { InjectQueue } from '@nestjs/bull';
import { EMAIL_QUEUE } from 'src/utils/queue-contract';
import { Queue } from 'bull';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectQueue(EMAIL_QUEUE) private emailQueue: Queue,
    private prisma: PrismaService,
  ) {}

  async createSchedule(data: CreateScheduleInput): Promise<Schedule> {
    const existingDoctor = await this.prisma.doctor.findUnique({
      where: { id: data.doctorId },
    });

    if (!existingDoctor) {
      throw new NotFoundException(`Doctor with id ${data.doctorId} not found`);
    }

    const existingCustomer = await this.prisma.customer.findUnique({
      where: { id: data.customerId },
    });

    if (!existingCustomer) {
      throw new NotFoundException(
        `Customer with id ${data.customerId} not found`,
      );
    }

    const overlappingSchedule = await this.prisma.schedule.findFirst({
      where: {
        doctorId: data.doctorId,
        scheduledAt: data.scheduledAt,
      },
    });

    if (overlappingSchedule) {
      throw new NotFoundException(
        `Doctor with id ${data.doctorId} already has a schedule at ${data.scheduledAt}`,
      );
    }

    const emailMessage = `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <p>
            <strong>Halo</strong> ${existingCustomer.name}<br>
            <strong>Keperluan:</strong> ${data.objective}
          </p>

          <div style="padding: 12px; background: #f5f5f5; border-radius: 4px;">
            Kamu memiliki jadwal baru dengan dokter ${existingDoctor.name} pada ${data.scheduledAt}.
          </div>
        </div>
      `;

    const job = await this.emailQueue.add('schedule-created', {
      email: existingCustomer.email,
      subject: 'Jadwal Konsultasi Baru',
      message: emailMessage,
    });

    console.log('Job created: ', job.id);

    return this.prisma.schedule.create({
      data: {
        objective: data.objective,
        doctorId: data.doctorId,
        customerId: data.customerId,
        scheduledAt: data.scheduledAt,
      },
      include: {
        doctor: true,
        customer: true,
      },
    });
  }

  async schedule(id: string): Promise<Schedule> {
    const existingSchedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: {
        doctor: true,
        customer: true,
      },
    });

    if (!existingSchedule) {
      throw new NotFoundException(`Schedule with id ${id} not found`);
    }

    return existingSchedule;
  }

  async schedules(args: ScheduleFilterArgs): Promise<ScheduleList> {
    const {
      skip = 0,
      take = 10,
      doctorId,
      customerId,
      objective,
      from,
      to,
    } = args;

    const where: any = {};

    if (doctorId) {
      where.doctorId = doctorId;
    }

    if (customerId) {
      where.customerId = customerId;
    }

    if (objective) {
      where.objective = {
        contains: objective,
        mode: 'insensitive',
      };
    }

    if (from || to) {
      where.scheduledAt = {};

      if (from) {
        where.scheduledAt.gte = from;
      }

      if (to) {
        where.scheduledAt.lte = to;
      }
    }

    const total = await this.prisma.schedule.count({ where });

    const data = await this.prisma.schedule.findMany({
      where,
      skip,
      take,
      orderBy: {
        scheduledAt: 'asc',
      },
      include: {
        doctor: true,
        customer: true,
      },
    });

    return {
      data,
      total,
      skip,
      take,
    };
  }
  async deleteSchedule(id: string): Promise<boolean> {
    const existingSchedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: {
        doctor: true,
        customer: true,
      },
    });

    if (!existingSchedule) {
      throw new NotFoundException(`Schedule with id ${id} not found`);
    }

    const emailMessage = `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <p>
            <strong>Halo</strong> ${existingSchedule.customer.name}<br>
            <strong>Keperluan:</strong> ${existingSchedule.objective}
          </p>

          <div style="padding: 12px; background: #f5f5f5; border-radius: 4px;">
            Jadwal kamu telah dibatalkan dengan dokter ${existingSchedule.doctor.name} pada ${existingSchedule.scheduledAt}.
          </div>
        </div>
      `;

    const job = await this.emailQueue.add('schedule-cancelled', {
      email: existingSchedule.customer.email,
      subject: 'Pembatalan Jadwal Konsultasi',
      message: emailMessage,
    });

    console.log('Job created: ', job.id);

    await this.prisma.schedule.delete({
      where: { id },
    });

    return true;
  }
}
