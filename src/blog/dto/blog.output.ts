import { ObjectType, Field } from '@nestjs/graphql';
import { DefaultEntityOutput } from 'src/common/defaultEntity/default.output';
import { Paginated } from 'src/common/pagination/pagination.output';
import { UserOutput } from 'src/user/dto';

@ObjectType('Blog')
export class BlogOutput extends DefaultEntityOutput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  description?: string;

  @Field(() => UserOutput)
  writer: UserOutput;
}

@ObjectType()
export class PaginatedBlogOutput extends Paginated(BlogOutput) {}
