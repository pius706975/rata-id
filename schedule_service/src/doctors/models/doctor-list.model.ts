import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Doctor } from './doctor.model';

@ObjectType()
export class DoctorList {
  @Field(() => [Doctor])
  data: Doctor[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  skip: number;

  @Field(() => Int)
  take: number;
}
