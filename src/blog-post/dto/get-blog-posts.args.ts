import {
  ArgsType,
  Field,
  InputType,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { PaginationArgs } from 'src/common/pagination/pagination.args';
import { BlogPostsOrderByEnum } from '../blog-post.interface';

@InputType()
export class BlogPostsFilterInput {
  @Field(() => Int, { nullable: true })
  blogId?: number;

  @Field(() => Int, { nullable: true })
  writerId?: number;
}

registerEnumType(BlogPostsOrderByEnum, {
  name: 'BlogPostsOrderByEnum',
});

@ArgsType()
export class GetBlogPostsArgs extends PaginationArgs {
  @Field(() => BlogPostsFilterInput, { nullable: true })
  filter?: BlogPostsFilterInput;

  @Field(() => BlogPostsOrderByEnum, { nullable: true })
  orderBy?: BlogPostsOrderByEnum;
}
