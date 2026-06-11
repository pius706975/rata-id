import { ArgsType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { SchedulePaginationArgs } from './schedule-pagination.args';

@ArgsType()
export class ScheduleFilterArgs extends SchedulePaginationArgs {
  @Field(() => String, { nullable: true })
  doctorId?: string;

  @Field(() => String, { nullable: true })
  customerId?: string;

  @Field(() => String, { nullable: true })
  objective?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  from?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  to?: Date;
}
