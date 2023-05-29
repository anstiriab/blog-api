import { ObjectType, Field } from '@nestjs/graphql';
import { DefaultEntityOutput } from 'src/common/defaultEntity/default.output';
import { BlogOutput } from 'src/blog/dto';
import { UserOutput } from 'src/user/dto';
import { Paginated } from 'src/common/pagination/pagination.output';

@ObjectType('BlogPost')
export class BlogPostOutput extends DefaultEntityOutput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;

  @Field(() => BlogOutput)
  blog: BlogOutput;

  @Field(() => UserOutput)
  writer: UserOutput;
}

@ObjectType()
export class PaginatedBlogPostOutput extends Paginated(BlogPostOutput) {}
