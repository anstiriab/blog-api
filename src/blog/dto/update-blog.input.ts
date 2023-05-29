import { CreateBlogInput } from './create-blog.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBlogInput extends PartialType(CreateBlogInput) {}
