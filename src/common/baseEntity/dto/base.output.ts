import { Type } from '@nestjs/common';
import { Field, GraphQLISODateTime, ObjectType, Int } from '@nestjs/graphql';
import { PaginatedTypeI } from '../base.interface';

@ObjectType()
export abstract class BaseEntityOutput {
  @Field(() => Int)
  id: number;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

export function Paginated<T>(classRef: Type<T>): Type<PaginatedTypeI<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements PaginatedTypeI<T> {
    @Field(() => [classRef], { nullable: true })
    edges: T[];

    @Field(() => Int)
    count: number;
  }

  return PaginatedType as Type<PaginatedTypeI<T>>;
}
