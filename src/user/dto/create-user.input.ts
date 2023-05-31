import { InputType, Field } from '@nestjs/graphql';
import {
  IsAlpha,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { NAME_LENGTH, UserRoleEnum } from '../user.interface';

@InputType()
export class CreateUserInput {
  @IsNotEmpty()
  @IsAlpha()
  @MaxLength(NAME_LENGTH)
  @Field(() => String)
  firstName: string;

  @IsNotEmpty()
  @IsAlpha()
  @MaxLength(NAME_LENGTH)
  @Field(() => String)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @Field(() => String)
  email: string;

  @IsNotEmpty()
  @IsEnum(UserRoleEnum)
  @Field(() => UserRoleEnum)
  role: UserRoleEnum;

  @IsNotEmpty()
  @IsString()
  // @IsStrongPassword()
  @Field(() => String)
  password: string;
}
