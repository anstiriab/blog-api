import {
  Field,
  GraphQLISODateTime,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { OrderEnum } from './base.interface';

@ObjectType()
export abstract class BaseEntityOutput {
  @Field(() => Int)
  id: number;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

registerEnumType(OrderEnum, {
  name: 'OrderEnum',
});
