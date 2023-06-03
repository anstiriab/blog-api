import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { BaseEntityOutput, Paginated } from 'src/common/baseEntity/dto';
import { UserRoleEnum } from '../user.interface';

@ObjectType('User')
export class UserOutput extends BaseEntityOutput {
  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  fullName: string;

  @Field(() => String)
  email: string;

  @Field(() => UserRoleEnum)
  role: UserRoleEnum;
}

registerEnumType(UserRoleEnum, {
  name: 'UserRoleEnum',
});

@ObjectType()
export class PaginatedUserOutput extends Paginated(UserOutput) {}
