import {
  ArgsType,
  Field,
  InputType,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { PaginationArgs } from 'src/common/pagination/pagination.args';
import { BlogsOrderByEnum } from '../blog.interface';

@InputType()
export class BlogsFilterInput {
  @Field(() => Int, { nullable: true })
  writerId?: number;
}

registerEnumType(BlogsOrderByEnum, {
  name: 'BlogsOrderByEnum',
});

@ArgsType()
export class GetBlogsArgs extends PaginationArgs {
  @Field(() => BlogsFilterInput, { nullable: true })
  filter?: BlogsFilterInput;

  @Field(() => BlogsOrderByEnum, { nullable: true })
  orderBy?: BlogsOrderByEnum;
}
