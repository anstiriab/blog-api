import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import {
  BLOG_DESCRIPTION_MAX_LENGTH,
  BLOG_TITLE_MAX_LENGTH,
} from '../blog.interface';

@InputType()
export class CreateBlogInput {
  @IsNotEmpty()
  @IsString()
  @MaxLength(BLOG_TITLE_MAX_LENGTH)
  @Field(() => String)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(BLOG_DESCRIPTION_MAX_LENGTH)
  @Field(() => String)
  description?: string;
}
