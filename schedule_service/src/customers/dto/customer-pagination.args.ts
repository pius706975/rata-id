import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsOptional, Min } from "class-validator";

@ArgsType()
export class CustomerPaginationArgs {
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @Min(0)
  skip?: number = 0;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsOptional()
  @Min(1)
  take?: number = 10;
}