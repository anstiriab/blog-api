import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntityOutput, Paginated } from 'src/common/baseEntity/dto';
import { UserOutput } from 'src/user/dto';

@ObjectType('Blog')
export class BlogOutput extends BaseEntityOutput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  description?: string;

  @Field(() => UserOutput, { nullable: true })
  writer?: UserOutput;
}

@ObjectType()
export class PaginatedBlogOutput extends Paginated(BlogOutput) {}
