import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleResolver } from '../schedule/schedule.resolver';
import { ScheduleService } from '../schedule/schedule.service';
import { HttpBearerGuard } from '../common/guards/http-bearer.guard';

describe('ScheduleResolver', () => {
  let resolver: ScheduleResolver;

  const serviceMock = {
    createSchedule: jest.fn().mockResolvedValue({
      id: '1',
      objective: 'Consultation',
    }),
    schedule: jest.fn().mockResolvedValue({
      id: '1',
      objective: 'Consultation',
    }),
    schedules: jest.fn().mockResolvedValue({
      data: [{ id: '1', objective: 'Consultation' }],
      total: 1,
      skip: 0,
      take: 10,
    }),
    deleteSchedule: jest.fn().mockResolvedValue(true),
  };

  const guardMock = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleResolver,
        {
          provide: ScheduleService,
          useValue: serviceMock,
        },
      ],
    })
      .overrideGuard(HttpBearerGuard)
      .useValue(guardMock)
      .compile();

    resolver = module.get<ScheduleResolver>(ScheduleResolver);
    jest.clearAllMocks();
  });

  it('should create schedule', async () => {
    const input = {
      objective: 'Consultation',
      doctorId: 'doc-1',
      customerId: 'cust-1',
      scheduledAt: new Date(),
    } as any;

    const result = await resolver.createSchedule(input);

    expect(result.id).toBe('1');
    expect(serviceMock.createSchedule).toHaveBeenCalledWith(input);
  });

  it('should get schedule by id', async () => {
    const result = await resolver.schedule('1');

    expect(result.id).toBe('1');
    expect(serviceMock.schedule).toHaveBeenCalledWith('1');
  });

  it('should get schedules with filters', async () => {
    const args = {
      skip: 0,
      take: 10,
      doctorId: 'doc-1',
    } as any;

    const result = await resolver.schedules(args);

    expect(result.total).toBe(1);
    expect(serviceMock.schedules).toHaveBeenCalledWith(args);
  });

  it('should delete schedule', async () => {
    const result = await resolver.deleteSchedule('1');

    expect(result).toBe(true);
    expect(serviceMock.deleteSchedule).toHaveBeenCalledWith('1');
  });
});
