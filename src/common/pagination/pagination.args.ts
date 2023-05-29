import { ArgsType, Field, Int } from '@nestjs/graphql';

export interface PaginationArgsI {
  skip: number;
  limit: number;
}

@ArgsType()
export class PaginationArgs {
  @Field(() => Int)
  skip = 0;

  @Field(() => Int)
  limit = 10;
}
