import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsEnum, MaxLength } from 'class-validator';
import { NAME_LENGTH, UserRoleEnum } from '../user.interface';

@InputType()
export class CreateUserInput {
  @MaxLength(NAME_LENGTH)
  @Field(() => String)
  firstName: string;

  @MaxLength(NAME_LENGTH)
  @Field(() => String)
  lastName: string;

  @IsEmail()
  @Field(() => String)
  email: string;

  @IsEnum(UserRoleEnum)
  @Field(() => UserRoleEnum)
  role: UserRoleEnum;

  @Field(() => String)
  password: string;
}
