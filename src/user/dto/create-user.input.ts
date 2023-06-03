import { InputType, Field } from '@nestjs/graphql';
import {
  IsAlpha,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRoleEnum } from '../user.interface';
import { NAME_LENGTH } from '../user.constants';

const transformName = (name: string) => {
  const value = name.trim();
  return value[0].toUpperCase() + value.substring(1).toLowerCase();
};

@InputType()
export class CreateUserInput {
  @IsNotEmpty()
  @IsAlpha()
  @MaxLength(NAME_LENGTH)
  @Transform(({ value }) => transformName(value))
  @Field(() => String)
  firstName: string;

  @IsNotEmpty()
  @IsAlpha()
  @MaxLength(NAME_LENGTH)
  @Transform(({ value }) => transformName(value))
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
  @Transform(({ value }) => value.trim())
  @Field(() => String)
  password: string;
}
