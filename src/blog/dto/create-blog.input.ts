import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import {
  BLOG_DESCRIPTION_MAX_LENGTH,
  BLOG_TITLE_MAX_LENGTH,
} from '../blog.constants';

@InputType()
export class CreateBlogInput {
  @IsNotEmpty()
  @IsString()
  @MaxLength(BLOG_TITLE_MAX_LENGTH)
  @Transform(({ value }) => value.trim())
  @Field(() => String)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(BLOG_DESCRIPTION_MAX_LENGTH)
  @Transform(({ value }) => value.trim())
  @Field(() => String)
  description?: string;
}
