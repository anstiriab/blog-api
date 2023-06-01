export interface BaseEntityI {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export type GetOneIdentifierT<Entity> = Partial<Record<keyof Entity, any>>;

export type GetOneOptionsT = { isThrowException: boolean };

type GetOneMethodT<Entity, Identifier extends GetOneIdentifierT<Entity>> = {
  (identifier: Identifier): Promise<Entity | null>;
  (
    identifier: Identifier,
    options: { isThrowException: true },
  ): Promise<Entity>;
  (identifier: Identifier, options?: GetOneOptionsT): Promise<Entity | null>;
};

export interface PaginationArgsI {
  skip: number;
  limit: number;
}

export enum OrderEnum {
  asc = 'ASC',
  desc = 'DESC',
}

export type GetManyOrderByT<SortField> = {
  sortField: SortField;
  order: OrderEnum;
};

export type GetManyArgsT<SortField> = {
  pagination: PaginationArgsI;
  orderBy?: GetManyOrderByT<SortField>;
};

export interface PaginatedTypeI<Entity> {
  edges: Entity[];
  count: number;
}

type GetManyMethodT<Entity, GetManyArgs extends GetManyArgsT<keyof Entity>> = {
  (args: GetManyArgs): Promise<PaginatedTypeI<Entity>>;
};

export interface BaseRepositoryI<
  Entity,
  Identifier extends GetOneIdentifierT<Entity>,
  GetManyArgs extends GetManyArgsT<keyof Entity>,
> {
  getOne: GetOneMethodT<Entity, Identifier>;
  getMany: GetManyMethodT<Entity, GetManyArgs>;
}
