import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from '../schedule/schedule.service';
import { PrismaService } from 'nestjs-prisma';
import { NotFoundException } from '@nestjs/common';
import { sendEmail } from '../utils/email';

jest.mock('../utils/email', () => ({
  sendEmail: jest.fn((to, subject, html, cb) => {
    cb(null, { messageId: 'mock-id' });
  }),
}));

describe('ScheduleService', () => {
  let service: ScheduleService;

  const prismaMock = {
    doctor: { findUnique: jest.fn() },
    customer: { findUnique: jest.fn() },
    schedule: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ScheduleService>(ScheduleService);

    jest.clearAllMocks();

    (sendEmail as jest.Mock).mockImplementation((to, subject, html, cb) => {
      cb(null, { messageId: 'mock-id' });
    });
  });

  describe('createSchedule', () => {
    const input = {
      objective: 'Consultation',
      doctorId: 'doc-1',
      customerId: 'cust-1',
      scheduledAt: new Date(),
    } as any;

    it('should throw if doctor not found', async () => {
      prismaMock.doctor.findUnique.mockResolvedValue(null);

      await expect(service.createSchedule(input)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw if customer not found', async () => {
      prismaMock.doctor.findUnique.mockResolvedValue({ id: 'doc-1' });
      prismaMock.customer.findUnique.mockResolvedValue(null);

      await expect(service.createSchedule(input)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw if schedule overlap exists', async () => {
      prismaMock.doctor.findUnique.mockResolvedValue({ id: 'doc-1' });
      prismaMock.customer.findUnique.mockResolvedValue({
        id: 'cust-1',
        email: 'test@mail.com',
      });
      prismaMock.schedule.findFirst.mockResolvedValue({ id: 'exist' });

      await expect(service.createSchedule(input)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should create schedule and send email', async () => {
      prismaMock.doctor.findUnique.mockResolvedValue({
        id: 'doc-1',
        name: 'Dr A',
      });
      prismaMock.customer.findUnique.mockResolvedValue({
        id: 'cust-1',
        name: 'Budi',
        email: 'budi@mail.com',
      });
      prismaMock.schedule.findFirst.mockResolvedValue(null);

      prismaMock.schedule.create.mockResolvedValue({
        id: 'sched-1',
        ...input,
      });

      const result = await service.createSchedule(input);

      expect(result.id).toBe('sched-1');
      expect(sendEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('schedule', () => {
    it('should return schedule by id', async () => {
      prismaMock.schedule.findUnique.mockResolvedValue({
        id: '1',
        doctor: {},
        customer: {},
      });

      const result = await service.schedule('1');

      expect(result.id).toBe('1');
    });

    it('should throw if not found', async () => {
      prismaMock.schedule.findUnique.mockResolvedValue(null);

      await expect(service.schedule('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('schedules', () => {
    it('should return schedules with pagination', async () => {
      prismaMock.schedule.count.mockResolvedValue(1);
      prismaMock.schedule.findMany.mockResolvedValue([{ id: '1' }]);

      const result = await service.schedules({} as any);

      expect(result.total).toBe(1);
    });

    it('should filter by doctorId and customerId', async () => {
      prismaMock.schedule.count.mockResolvedValue(1);
      prismaMock.schedule.findMany.mockResolvedValue([{ id: '1' }]);

      await service.schedules({
        doctorId: 'doc-1',
        customerId: 'cust-1',
      } as any);

      expect(prismaMock.schedule.findMany).toHaveBeenCalled();
    });
  });

  describe('deleteSchedule', () => {
    it('should throw if not found', async () => {
      prismaMock.schedule.findUnique.mockResolvedValue(null);

      await expect(service.deleteSchedule('1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should delete schedule and send email', async () => {
      prismaMock.schedule.findUnique.mockResolvedValue({
        id: '1',
        objective: 'test',
        scheduledAt: new Date(),
        doctor: { name: 'Dr A' },
        customer: { name: 'Budi', email: 'budi@mail.com' },
      });

      prismaMock.schedule.delete.mockResolvedValue({ id: '1' });

      const result = await service.deleteSchedule('1');

      expect(result).toBe(true);
      expect(sendEmail).toHaveBeenCalledTimes(1);
    });
  });
});
