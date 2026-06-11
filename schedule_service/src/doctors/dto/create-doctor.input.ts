import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class CreateDoctorInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;
}
