import { Repository, SelectQueryBuilder } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { BaseEntity } from './base.entity';
import {
  BaseRepositoryI,
  PaginationI,
  SortingT,
  IdentifierT,
  GetOneOptionsT,
  OrderEnum,
  SortingI,
  PaginatedTypeI,
  PaginationArgsT,
} from './base.interface';

export class BaseRepository<
    Entity extends BaseEntity,
    Identifier extends IdentifierT<Entity>,
    GetManyArgs extends PaginationI & SortingI<keyof Entity>,
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
      throw new NotFoundException('Not found');
    }
    return entity;
  }

  async getMany(
    args: PaginationI & SortingI<keyof Entity>,
    queryBuilder?: SelectQueryBuilder<Entity>,
  ): Promise<PaginatedTypeI<Entity>> {
    if (!queryBuilder) {
      const tableName = this.metadata.givenTableName;
      queryBuilder = this.createQueryBuilder(tableName);
    }

    const { pagination, sorting } = args;
    queryBuilder = this.addSortingToQueryBuilder(queryBuilder, sorting);
    const result = await this.getPaginatedResultFromQueryBuilder(
      queryBuilder,
      pagination,
    );

    return result;
  }

  private addSortingToQueryBuilder(
    queryBuilder: SelectQueryBuilder<Entity>,
    sorting?: SortingT<keyof Entity>,
  ): SelectQueryBuilder<Entity> {
    const tableName = this.metadata.givenTableName;

    if (sorting) {
      const field = sorting.field as string;
      queryBuilder.orderBy(`${tableName}.${field}`, sorting.order);
    } else {
      queryBuilder.orderBy(`${tableName}.createdAt`, OrderEnum.desc);
    }

    return queryBuilder;
  }

  private async getPaginatedResultFromQueryBuilder(
    queryBuilder: SelectQueryBuilder<Entity>,
    pagination: PaginationArgsT,
  ): Promise<PaginatedTypeI<Entity>> {
    const { skip, limit } = pagination;

    const count = await queryBuilder.getCount();
    queryBuilder.skip(skip);
    queryBuilder.take(limit);

    const posts = await queryBuilder.getMany();

    return { count, edges: posts };
  }
}
