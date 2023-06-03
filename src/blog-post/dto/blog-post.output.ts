import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntityOutput, Paginated } from 'src/common/baseEntity/dto';
import { BlogOutput } from 'src/blog/dto';
import { UserOutput } from 'src/user/dto';

@ObjectType('BlogPost')
export class BlogPostOutput extends BaseEntityOutput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;

  @Field(() => BlogOutput, { nullable: true })
  blog?: BlogOutput;

  @Field(() => UserOutput, { nullable: true })
  writer?: UserOutput;
}

@ObjectType()
export class PaginatedBlogPostOutput extends Paginated(BlogPostOutput) {}
