import {
  ArgsType,
  Field,
  InputType,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { SortingInput, PaginationArgs } from 'src/common/baseEntity/dto';
import { BlogsSortingFieldsEnum } from '../blog.interface';

registerEnumType(BlogsSortingFieldsEnum, {
  name: 'BlogsSortingFieldsEnum',
});

@InputType()
export class BlogsFilterInput {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Field(() => Int, { nullable: true })
  writerId?: number;
}

@InputType()
export class BlogsSortingInput extends SortingInput<BlogsSortingFieldsEnum> {
  @IsNotEmpty()
  @IsEnum(BlogsSortingFieldsEnum)
  @Field(() => BlogsSortingFieldsEnum)
  field: BlogsSortingFieldsEnum;
}

@ArgsType()
export class GetManyBlogsArgs extends PaginationArgs {
  @IsOptional()
  @Field(() => BlogsFilterInput, { nullable: true })
  filter?: BlogsFilterInput;

  @IsOptional()
  @Field(() => BlogsSortingInput, { nullable: true })
  sorting?: BlogsSortingInput;
}
