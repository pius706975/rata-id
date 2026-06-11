import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { NotFoundException } from '@nestjs/common';
import { CustomerService } from '../../src/customers/customer.service';

describe('CustomerService', () => {
  let service: CustomerService;

  const prismaMock = {
    customer: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCustomer', () => {
    it('should create customer', async () => {
      const input = { name: 'John', email: 'john@mail.com' };

      prismaMock.customer.create.mockResolvedValue({
        id: '1',
        ...input,
      });

      const result = await service.createCustomer(input);

      expect(result.name).toBe('John');
      expect(prismaMock.customer.create).toHaveBeenCalled();
    });
  });

  describe('customer', () => {
    it('should return customer', async () => {
      prismaMock.customer.findUnique.mockResolvedValue({
        id: '1',
        name: 'John',
        email: 'john@mail.com',
      });

      const result = await service.customer('1');

      expect(result.id).toBe('1');
    });

    it('should throw if not found', async () => {
      prismaMock.customer.findUnique.mockResolvedValue(null);

      await expect(service.customer('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('customers', () => {
    it('should return paginated customers', async () => {
      prismaMock.customer.count.mockResolvedValue(1);

      prismaMock.customer.findMany.mockResolvedValue([
        { id: '1', name: 'John', email: 'john@mail.com' },
      ]);

      const result = await service.customers(0, 10);

      expect(result.data.length).toBe(1);
      expect(result.total).toBe(1);
    });
  });

  describe('updateCustomer', () => {
    it('should update customer', async () => {
      prismaMock.customer.findUnique.mockResolvedValue({
        id: '1',
      });

      prismaMock.customer.update.mockResolvedValue({
        id: '1',
        name: 'Updated',
        email: 'updated@mail.com',
      });

      const result = await service.updateCustomer('1', {
        name: 'Updated',
        email: 'updated@mail.com',
      });

      expect(result.name).toBe('Updated');
    });

    it('should throw if customer not found', async () => {
      prismaMock.customer.findUnique.mockResolvedValue(null);

      await expect(service.updateCustomer('1', { name: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteCustomer', () => {
    it('should delete customer', async () => {
      prismaMock.customer.findUnique.mockResolvedValue({
        id: '1',
      });

      prismaMock.customer.delete.mockResolvedValue({ id: '1' });

      const result = await service.deleteCustomer('1');

      expect(result).toBe(true);
    });

    it('should throw if customer not found', async () => {
      prismaMock.customer.findUnique.mockResolvedValue(null);

      await expect(service.deleteCustomer('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
