import { ArgsType, Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { SortingInput, PaginationArgs } from 'src/common/baseEntity/dto';
import { UsersSortingFieldsEnum } from '../user.interface';

registerEnumType(UsersSortingFieldsEnum, {
  name: 'UsersSortingFieldsEnum',
});

@InputType()
export class UsersSortingInput extends SortingInput<UsersSortingFieldsEnum> {
  @IsNotEmpty()
  @IsEnum(UsersSortingFieldsEnum)
  @Field(() => UsersSortingFieldsEnum)
  field: UsersSortingFieldsEnum;
}

@ArgsType()
export class GetManyUserArgs extends PaginationArgs {
  @IsOptional()
  @Field(() => UsersSortingInput, { nullable: true })
  sorting?: UsersSortingInput;
}
