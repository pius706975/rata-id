import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Schedule } from './schedule.model';

@ObjectType()
export class ScheduleList {
  @Field(() => [Schedule])
  data: Schedule[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  skip: number;

  @Field(() => Int)
  take: number;
}
