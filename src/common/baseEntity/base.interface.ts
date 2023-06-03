export interface BaseEntityI {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export type IdentifierT<Entity> = Partial<Record<keyof Entity, any>>;

export type GetOneOptionsT = { isThrowException: boolean };

type GetOneMethodT<Entity, Id extends IdentifierT<Entity>> = {
  (identifier: Id): Promise<Entity | null>;
  (identifier: Id, options: { isThrowException: true }): Promise<Entity>;
  (identifier: Id, options?: GetOneOptionsT): Promise<Entity | null>;
};

export type PaginationArgsT = {
  skip: number;
  limit: number;
};

export interface PaginationI {
  pagination: PaginationArgsT;
}

export enum OrderEnum {
  asc = 'ASC',
  desc = 'DESC',
}

export type SortingT<Field> = {
  field: Field;
  order: OrderEnum;
};
export interface SortingI<Field> {
  sorting?: SortingT<Field>;
}

export interface PaginatedTypeI<Entity> {
  edges: Entity[];
  count: number;
}

type GetManyMethodT<
  Entity,
  GetManyArgs extends PaginationI & SortingI<keyof Entity>,
> = {
  (args: GetManyArgs): Promise<PaginatedTypeI<Entity>>;
};

export interface BaseRepositoryI<
  Entity,
  Identifier extends IdentifierT<Entity>,
  GetManyArgs extends PaginationI & SortingI<keyof Entity>,
> {
  getOne: GetOneMethodT<Entity, Identifier>;
  getMany: GetManyMethodT<Entity, GetManyArgs>;
}
