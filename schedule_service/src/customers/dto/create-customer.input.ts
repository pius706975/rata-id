import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

@InputType()
export class CreateCustomerInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  email: string;
}