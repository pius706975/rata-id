import { ObjectType, Field, ID, GraphQLISODateTime } from '@nestjs/graphql';
import { Customer } from 'src/customers/models/customer.model';
import { Doctor } from 'src/doctors/models/doctor.model';

@ObjectType()
export class Schedule {
  @Field(() => ID)
  id: string;

  @Field()
  objective: string;

  @Field()
  doctorId: string;

  @Field()
  customerId: string;

  @Field(() => Doctor)
  doctor: Doctor;

  @Field(() => Customer)
  customer: Customer;

  @Field(() => GraphQLISODateTime)
  scheduledAt: Date;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
