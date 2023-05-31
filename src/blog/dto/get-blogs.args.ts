import {
  ArgsType,
  Field,
  InputType,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { PaginationArgs } from 'src/common/pagination/pagination.args';
import { BlogsOrderByEnum } from '../blog.interface';

@InputType()
export class BlogsFilterInput {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Field(() => Int, { nullable: true })
  writerId?: number;
}

registerEnumType(BlogsOrderByEnum, {
  name: 'BlogsOrderByEnum',
});

@ArgsType()
export class GetBlogsArgs extends PaginationArgs {
  @IsOptional()
  @Field(() => BlogsFilterInput, { nullable: true })
  filter?: BlogsFilterInput;

  @IsOptional()
  @IsEnum(BlogsOrderByEnum)
  @Field(() => BlogsOrderByEnum, { nullable: true })
  orderBy?: BlogsOrderByEnum;
}
