import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Customer } from './customer.model';

@ObjectType()
export class CustomerList {
  @Field(() => [Customer])
  data: Customer[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  skip: number;

  @Field(() => Int)
  take: number;
}
