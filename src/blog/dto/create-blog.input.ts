import { InputType, Field } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { BLOG_TITLE_LENGTH } from '../blog.interface';

@InputType()
export class CreateBlogInput {
  @MaxLength(BLOG_TITLE_LENGTH)
  @Field(() => String)
  title: string;

  @Field(() => String)
  description?: string;
}
