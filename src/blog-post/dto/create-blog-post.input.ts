import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';
import {
  BLOG_POST_CONTENT_MAX_LENGTH,
  BLOG_POST_TITLE_MAX_LENGTH,
} from '../blog-post.constants';
import { Transform } from 'class-transformer';

@InputType()
export class CreateBlogPostInput {
  @IsNotEmpty()
  @IsString()
  @MaxLength(BLOG_POST_TITLE_MAX_LENGTH)
  @Transform(({ value }) => value.trim())
  @Field(() => String)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(BLOG_POST_CONTENT_MAX_LENGTH)
  @Field(() => String)
  content: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Field(() => Int)
  blogId: number;
}
