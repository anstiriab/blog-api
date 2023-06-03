// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Repository, SelectQueryBuilder } from 'typeorm';

export type MockType<T> = {
  [P in keyof T]: jest.Mock<any>;
};

export const dataSourceMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    createEntityManager: jest.fn(() => null),
  }),
);

export const customRepositoryMockFactory: () => MockType<Repository<any>> =
  jest.fn(() => ({
    getOne: jest.fn((entity) => entity),
    getMany: jest.fn(() => []),
    createOne: jest.fn((entity) => entity),
    updateOne: jest.fn((entity) => entity),
    removeOne: jest.fn((entity) => entity),
  }));

export const createQueryBuilderMock: () => MockType<SelectQueryBuilder<any>> =
  jest.fn(() => ({
    where: jest.fn(() => createQueryBuilderMock()),
    andWhere: jest.fn(() => createQueryBuilderMock()),
    orderBy: jest.fn(() => createQueryBuilderMock()),
    skip: jest.fn(() => createQueryBuilderMock()),
    take: jest.fn(() => createQueryBuilderMock()),
    getCount: jest.fn((count) => count),
    getMany: jest.fn(() => []),
  }));
