import { Type } from '@nestjs/common';
import { Field, ObjectType, Int } from '@nestjs/graphql';

export interface PaginatedTypeI<T> {
  edges: T[];
  count: number;
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
