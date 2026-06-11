import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { Schedule } from './models/schedule.model';
import { HttpBearerGuard } from 'src/common/guards/http-bearer.guard';
import { UseGuards } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleInput } from './dto/create-schedule.input';
import { ScheduleList } from './models/schedule-list';
import { SchedulePaginationArgs } from './dto/schedule-pagination.args';
import { ScheduleFilterArgs } from './dto/schedule-filter.args';

@Resolver(() => Schedule)
@UseGuards(HttpBearerGuard)
export class ScheduleResolver {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Mutation(() => Schedule, { description: 'Create a new schedule' })
  async createSchedule(
    @Args('data') data: CreateScheduleInput,
  ): Promise<Schedule> {
    return this.scheduleService.createSchedule(data);
  }

  @Query(() => Schedule, { description: 'Get schedule by ID' })
  async schedule(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Schedule> {
    return this.scheduleService.schedule(id);
  }

@Query(() => ScheduleList, {
  description: 'Get all schedules with filters + pagination',
})
async schedules(@Args() args: ScheduleFilterArgs): Promise<ScheduleList> {
  return this.scheduleService.schedules(args);
}

  @Mutation(() => Boolean, { description: 'Delete schedule' })
  async deleteSchedule(
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    return this.scheduleService.deleteSchedule(id);
  }
}
