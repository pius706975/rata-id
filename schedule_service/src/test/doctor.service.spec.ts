import { Test, TestingModule } from '@nestjs/testing';
import { DoctorService } from '../doctors/doctors.service';
import { PrismaService } from 'nestjs-prisma';
import { NotFoundException } from '@nestjs/common';

describe('DoctorService', () => {
  let service: DoctorService;

  const prismaMock = {
    doctor: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<DoctorService>(DoctorService);
    jest.clearAllMocks();
  });

  describe('createDoctor', () => {
    it('should create doctor', async () => {
      prismaMock.doctor.create.mockResolvedValue({
        id: '1',
        name: 'Dr A',
      });

      const result = await service.createDoctor({
        name: 'Dr A',
      } as any);

      expect(result.name).toBe('Dr A');
      expect(prismaMock.doctor.create).toHaveBeenCalled();
    });
  });

  describe('doctor', () => {
    it('should return doctor by id', async () => {
      prismaMock.doctor.findUnique.mockResolvedValue({
        id: '1',
        name: 'Dr A',
      });

      const result = await service.doctor('1');

      expect(result.id).toBe('1');
    });

    it('should throw if doctor not found', async () => {
      prismaMock.doctor.findUnique.mockResolvedValue(null);

      await expect(service.doctor('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('doctors', () => {
    it('should return paginated doctors', async () => {
      prismaMock.doctor.count.mockResolvedValue(2);
      prismaMock.doctor.findMany.mockResolvedValue([
        { id: '1', name: 'A' },
        { id: '2', name: 'B' },
      ]);

      const result = await service.doctors();

      expect(result.total).toBe(2);
      expect(result.data.length).toBe(2);
      expect(result.skip).toBe(0);
      expect(result.take).toBe(10);
    });

    it('should call findMany with custom pagination', async () => {
      prismaMock.doctor.count.mockResolvedValue(1);
      prismaMock.doctor.findMany.mockResolvedValue([{ id: '1', name: 'A' }]);

      await service.doctors(5, 20);

      expect(prismaMock.doctor.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5,
          take: 20,
        }),
      );
    });
  });

  describe('updateDoctor', () => {
    it('should throw if doctor not found', async () => {
      prismaMock.doctor.findUnique.mockResolvedValue(null);

      await expect(
        service.updateDoctor('1', { name: 'New Name' } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update doctor', async () => {
      prismaMock.doctor.findUnique.mockResolvedValue({
        id: '1',
        name: 'Old',
      });

      prismaMock.doctor.update.mockResolvedValue({
        id: '1',
        name: 'New Name',
      });

      const result = await service.updateDoctor('1', {
        name: 'New Name',
      } as any);

      expect(result.name).toBe('New Name');
    });
  });

  describe('deleteDoctor', () => {
    it('should throw if doctor not found', async () => {
      prismaMock.doctor.findUnique.mockResolvedValue(null);

      await expect(service.deleteDoctor('1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should delete doctor', async () => {
      prismaMock.doctor.findUnique.mockResolvedValue({
        id: '1',
        name: 'Dr A',
      });

      prismaMock.doctor.delete.mockResolvedValue({ id: '1' });

      const result = await service.deleteDoctor('1');

      expect(result).toBe(true);
      expect(prismaMock.doctor.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
