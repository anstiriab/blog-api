import { CreateBlogPostInput } from './create-blog-post.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBlogPostInput extends PartialType(CreateBlogPostInput) {}
