import { Test, TestingModule } from '@nestjs/testing';
import { CustomerResolver } from '../customers/customer.resolver';
import { CustomerService } from '../customers/customer.service';
import { HttpBearerGuard } from '../common/guards/http-bearer.guard';

describe('CustomerResolver', () => {
  let resolver: CustomerResolver;

  const serviceMock = {
    createCustomer: jest.fn().mockResolvedValue({
      id: '1',
      name: 'Budi',
      email: 'budi@mail.com',
    }),
    customer: jest.fn().mockResolvedValue({
      id: '1',
      name: 'Budi',
      email: 'budi@mail.com',
    }),
    customers: jest.fn().mockResolvedValue({
      data: [
        { id: '1', name: 'Budi', email: 'budi@mail.com' },
      ],
      total: 1,
      skip: 0,
      take: 10,
    }),
    updateCustomer: jest.fn().mockResolvedValue({
      id: '1',
      name: 'Updated',
      email: 'updated@mail.com',
    }),
    deleteCustomer: jest.fn().mockResolvedValue(true),
  };

  const guardMock = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerResolver,
        {
          provide: CustomerService,
          useValue: serviceMock,
        },
      ],
    })
      .overrideGuard(HttpBearerGuard)
      .useValue(guardMock)
      .compile();

    resolver = module.get<CustomerResolver>(CustomerResolver);
    jest.clearAllMocks();
  });

  it('should create customer', async () => {
    const result = await resolver.createCustomer({
      name: 'Budi',
      email: 'budi@mail.com',
    } as any);

    expect(result.id).toBe('1');
    expect(serviceMock.createCustomer).toHaveBeenCalledWith({
      name: 'Budi',
      email: 'budi@mail.com',
    });
  });

  it('should get customer by id', async () => {
    const result = await resolver.customer('1');

    expect(result.id).toBe('1');
    expect(serviceMock.customer).toHaveBeenCalledWith('1');
  });

  it('should get customers list', async () => {
    const result = await resolver.customers({
      skip: 0,
      take: 10,
    } as any);

    expect(result.total).toBe(1);
    expect(serviceMock.customers).toHaveBeenCalledWith(0, 10);
  });

  it('should update customer', async () => {
    const result = await resolver.updateCustomer('1', {
      name: 'Updated',
      email: 'updated@mail.com',
    } as any);

    expect(result.name).toBe('Updated');
    expect(serviceMock.updateCustomer).toHaveBeenCalledWith('1', {
      name: 'Updated',
      email: 'updated@mail.com',
    });
  });

  it('should delete customer', async () => {
    const result = await resolver.deleteCustomer('1');

    expect(result).toBe(true);
    expect(serviceMock.deleteCustomer).toHaveBeenCalledWith('1');
  });
});