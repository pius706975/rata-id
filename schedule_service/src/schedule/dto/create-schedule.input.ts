import { Field, GraphQLISODateTime, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateScheduleInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  objective: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @Field(() => GraphQLISODateTime)
  @Type(() => Date)
  @IsDate()
  scheduledAt: Date;
}
