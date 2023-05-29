import { InputType, Field, Int } from '@nestjs/graphql';
import { BLOG_POST_TITLE_LENGTH } from '../blog-post.interface';
import { MaxLength } from 'class-validator';

@InputType()
export class CreateBlogPostInput {
  @MaxLength(BLOG_POST_TITLE_LENGTH)
  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;

  @Field(() => Int)
  blogId: number;
}
