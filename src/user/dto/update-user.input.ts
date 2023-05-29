import { CreateUserInput } from './create-user.input';
import { InputType, PartialType, OmitType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends OmitType(PartialType(CreateUserInput), [
  'role',
]) {}
