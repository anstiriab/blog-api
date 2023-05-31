import {
  ArgsType,
  Field,
  InputType,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { PaginationArgs } from 'src/common/pagination/pagination.args';
import { BlogPostsOrderByEnum } from '../blog-post.interface';

@InputType()
export class BlogPostsFilterInput {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Field(() => Int, { nullable: true })
  blogId?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Field(() => Int, { nullable: true })
  writerId?: number;
}

registerEnumType(BlogPostsOrderByEnum, {
  name: 'BlogPostsOrderByEnum',
});

@ArgsType()
export class GetBlogPostsArgs extends PaginationArgs {
  @IsOptional()
  @Field(() => BlogPostsFilterInput, { nullable: true })
  filter?: BlogPostsFilterInput;

  @IsOptional()
  @IsEnum(BlogPostsOrderByEnum)
  @Field(() => BlogPostsOrderByEnum, { nullable: true })
  orderBy?: BlogPostsOrderByEnum;
}
