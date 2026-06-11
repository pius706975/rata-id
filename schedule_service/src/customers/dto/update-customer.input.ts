import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

@InputType()
export class UpdateCustomerInput {
  @Field({nullable: true})
  @IsString()
  @IsOptional()
  @MinLength(2)
  name?: string;

  @Field({nullable: true})
  @IsString()
  @IsOptional()
  email?: string;
}