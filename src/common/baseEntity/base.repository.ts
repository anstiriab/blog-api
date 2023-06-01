import { Repository, SelectQueryBuilder } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { BaseEntity } from './base.entity';
import {
  BaseRepositoryI,
  GetManyArgsT,
  GetManyOrderByT,
  GetOneIdentifierT,
  GetOneOptionsT,
  OrderEnum,
  PaginatedTypeI,
  PaginationArgsI,
} from './base.interface';

export class BaseRepository<
    Entity extends BaseEntity,
    Identifier extends GetOneIdentifierT<Entity>,
    GetManyArgs extends GetManyArgsT<keyof Entity>,
  >
  extends Repository<Entity>
  implements BaseRepositoryI<Entity, Identifier, GetManyArgs>
{
  async getOne(identifier: Identifier): Promise<Entity | null>;
  async getOne(
    identifier: Identifier,
    options: { isThrowException: true },
  ): Promise<Entity>;
  async getOne(
    identifier: Identifier,
    options?: GetOneOptionsT,
  ): Promise<Entity | null> {
    const entity = await this.findOneBy(identifier);
    if (!entity && options?.isThrowException === true) {
      throw new NotFoundException('User not found');
    }
    return entity;
  }

  async getMany(
    args: GetManyArgsT<keyof Entity>,
  ): Promise<PaginatedTypeI<Entity>> {
    const { pagination, orderBy } = args;

    const tableName = this.metadata.givenTableName;
    let queryBuilder = this.createQueryBuilder(tableName);

    queryBuilder = this.addSortingToQueryBuilder(queryBuilder, orderBy);

    const result = await this.getPaginatedResultFromQueryBuilder(
      queryBuilder,
      pagination,
    );

    return result;
  }

  protected addSortingToQueryBuilder(
    queryBuilder: SelectQueryBuilder<Entity>,
    orderBy: GetManyOrderByT<keyof Entity>,
  ): SelectQueryBuilder<Entity> {
    const tableName = this.metadata.givenTableName;

    if (orderBy) {
      const sortField = orderBy.sortField as string;
      queryBuilder.orderBy(`${tableName}.${sortField}`, orderBy.order);
    } else {
      queryBuilder.orderBy(`${tableName}.createdAt`, OrderEnum.desc);
    }

    return queryBuilder;
  }

  protected async getPaginatedResultFromQueryBuilder(
    queryBuilder: SelectQueryBuilder<Entity>,
    pagination: PaginationArgsI,
  ): Promise<PaginatedTypeI<Entity>> {
    const { skip, limit } = pagination;

    const count = await queryBuilder.getCount();
    queryBuilder.skip(skip);
    queryBuilder.take(limit);

    const posts = await queryBuilder.getMany();

    return { count, edges: posts };
  }
}
