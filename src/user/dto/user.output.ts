import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { DefaultEntityOutput } from 'src/common/defaultEntity/default.output';
import { UserRoleEnum } from '../user.interface';

@ObjectType('User')
export class UserOutput extends DefaultEntityOutput {
  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  email: string;

  @Field(() => UserRoleEnum)
  role: UserRoleEnum;
}

registerEnumType(UserRoleEnum, {
  name: 'UserRoleEnum',
});
