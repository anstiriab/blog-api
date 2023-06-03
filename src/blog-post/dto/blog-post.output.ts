import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntityOutput, Paginated } from 'src/common/baseEntity/dto';
import { BlogBaseOutput } from 'src/blog/dto';
import { UserOutput } from 'src/user/dto';

@ObjectType('BlogPostBase')
export class BlogPostBaseOutput extends BaseEntityOutput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;
}

@ObjectType('BlogPost')
export class BlogPostOutput extends BlogPostBaseOutput {
  @Field(() => BlogBaseOutput, { nullable: true })
  blog?: BlogBaseOutput;

  @Field(() => UserOutput, { nullable: true })
  writer?: UserOutput;
}

@ObjectType()
export class PaginatedBlogPostOutput extends Paginated(BlogPostOutput) {}
