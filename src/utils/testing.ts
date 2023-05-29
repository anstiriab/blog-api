// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Repository, SelectQueryBuilder } from 'typeorm';

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOneBy: jest.fn((entity) => entity),
    findOne: jest.fn((entity) => entity),
    find: jest.fn(() => []),
    create: jest.fn((entity) => entity),
    update: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
    remove: jest.fn((entity) => entity),
    createQueryBuilder: createQueryBuilderMock,
  }),
);

export const createQueryBuilderMock: () => MockType<SelectQueryBuilder<any>> =
  jest.fn(() => ({
    where: jest.fn(() => createQueryBuilderMock()),
    andWhere: jest.fn(() => createQueryBuilderMock()),
    orWhere: jest.fn(() => createQueryBuilderMock()),
    innerJoin: jest.fn(() => createQueryBuilderMock()),
    leftJoin: jest.fn(() => createQueryBuilderMock()),
    leftJoinAndSelect: jest.fn(() => createQueryBuilderMock()),
    orderBy: jest.fn(() => createQueryBuilderMock()),
    skip: jest.fn(() => createQueryBuilderMock()),
    take: jest.fn(() => createQueryBuilderMock()),
    getCount: jest.fn((count) => count),
    getOne: jest.fn((entity) => entity),
    getMany: jest.fn(() => []),
  }));

export type MockType<T> = {
  [P in keyof T]: jest.Mock<any>;
};
