import {
  ArgsType,
  Field,
  InputType,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { SortingInput, PaginationArgs } from 'src/common/baseEntity/dto';
import { BlogPostsSortingFieldsEnum } from '../blog-post.interface';

registerEnumType(BlogPostsSortingFieldsEnum, {
  name: 'BlogPostsSortingFieldsEnum',
});

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

@InputType()
export class BlogPostsSortingInput extends SortingInput<BlogPostsSortingFieldsEnum> {
  @IsNotEmpty()
  @IsEnum(BlogPostsSortingFieldsEnum)
  @Field(() => BlogPostsSortingFieldsEnum)
  field: BlogPostsSortingFieldsEnum;
}

@ArgsType()
export class GetManyBlogPostArgs extends PaginationArgs {
  @IsOptional()
  @Field(() => BlogPostsFilterInput, { nullable: true })
  filter?: BlogPostsFilterInput;

  @IsOptional()
  @Field(() => BlogPostsSortingInput, { nullable: true })
  sorting?: BlogPostsSortingInput;
}
