import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, Max, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @IsInt()
  @Min(0)
  @Field(() => Int)
  skip = 0;

  @IsInt()
  @Min(1)
  @Max(50)
  @Field(() => Int)
  limit = 10;
}
