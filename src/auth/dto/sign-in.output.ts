import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignInOutput {
  @Field(() => String)
  accessToken: string;
}
