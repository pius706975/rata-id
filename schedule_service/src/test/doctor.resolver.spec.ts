import { Test, TestingModule } from '@nestjs/testing';
import { DoctorResolver } from '../doctors/doctors.resolver';
import { DoctorService } from '../doctors/doctors.service';
import { HttpBearerGuard } from '../common/guards/http-bearer.guard';

describe('DoctorResolver', () => {
  let resolver: DoctorResolver;

  const serviceMock = {
    createDoctor: jest.fn().mockResolvedValue({ id: '1', name: 'Dr A' }),
    doctor: jest.fn().mockResolvedValue({ id: '1', name: 'Dr A' }),
    doctors: jest.fn().mockResolvedValue({
      data: [{ id: '1', name: 'Dr A' }],
      total: 1,
      skip: 0,
      take: 10,
    }),
    updateDoctor: jest.fn().mockResolvedValue({ id: '1', name: 'Updated' }),
    deleteDoctor: jest.fn().mockResolvedValue(true),
  };

  const guardMock = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorResolver,
        {
          provide: DoctorService,
          useValue: serviceMock,
        },
      ],
    })
      .overrideGuard(HttpBearerGuard)
      .useValue(guardMock)
      .compile();

    resolver = module.get<DoctorResolver>(DoctorResolver);
    jest.clearAllMocks();
  });

  it('should create doctor', async () => {
    const result = await resolver.createDoctor({ name: 'Dr A' } as any);

    expect(result.id).toBe('1');
    expect(serviceMock.createDoctor).toHaveBeenCalledWith({
      name: 'Dr A',
    });
  });

  it('should get doctor by id', async () => {
    const result = await resolver.doctor('1');

    expect(result.id).toBe('1');
    expect(serviceMock.doctor).toHaveBeenCalledWith('1');
  });

  it('should get doctors list', async () => {
    const result = await resolver.doctors({ skip: 0, take: 10 } as any);

    expect(result.total).toBe(1);
    expect(serviceMock.doctors).toHaveBeenCalledWith(0, 10);
  });

  it('should update doctor', async () => {
    const result = await resolver.updateDoctor('1', {
      name: 'Updated',
    } as any);

    expect(result.name).toBe('Updated');
    expect(serviceMock.updateDoctor).toHaveBeenCalledWith('1', {
      name: 'Updated',
    });
  });

  it('should delete doctor', async () => {
    const result = await resolver.deleteDoctor('1');

    expect(result).toBe(true);
    expect(serviceMock.deleteDoctor).toHaveBeenCalledWith('1');
  });
});