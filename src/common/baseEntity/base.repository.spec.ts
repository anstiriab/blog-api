import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { createQueryBuilderMock } from 'src/utils/testing';
import {
  PaginationI,
  IdentifierT,
  OrderEnum,
  SortingI,
} from 'src/common/baseEntity/base.interface';
import { BaseRepository } from './base.repository';
import { BaseEntity } from './base.entity';
import { BlogEntity } from 'src/blog/blog.entity';

type RepositoryT = BaseRepository<
  BaseEntity,
  IdentifierT<BaseEntity>,
  PaginationI & SortingI<keyof BaseEntity>
>;

describe('BaseRepository', () => {
  let repository: RepositoryT;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BaseRepository],
    }).compile();

    repository = module.get<RepositoryT>(BaseRepository);
  });

  it('should find entity', async () => {
    const blogId = 1000;
    const blog = new BlogEntity();
    blog.id = blogId;
    jest.spyOn(repository, 'findOneBy').mockImplementation(async () => blog);

    const result = await repository.getOne({ id: blogId });
    expect(result).toEqual(blog);
  });

  it('should not find entity', async () => {
    const blogId = 1000;
    jest.spyOn(repository, 'findOneBy').mockImplementation(async () => null);

    const result = await repository.getOne({ id: blogId });
    expect(result).toEqual(null);
  });

  it('should not find entity and throw error', async () => {
    const blogId = 1000;
    jest.spyOn(repository, 'findOneBy').mockImplementation(async () => null);

    try {
      await repository.getOne({ id: blogId }, { isThrowException: true });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });

  it('should return list of entities', async () => {
    const techBlog = new BlogEntity();
    const musicBlog = new BlogEntity();
    const expectedBlogs = [techBlog, musicBlog];

    const queryBuilder = createQueryBuilderMock();
    queryBuilder.getMany.mockReturnValue(expectedBlogs);
    queryBuilder.getCount.mockReturnValue(2);

    jest.spyOn(repository, 'metadata', 'get').mockReturnValue({
      givenTableName: 'blog',
    } as any);
    jest
      .spyOn(repository, 'createQueryBuilder')
      .mockImplementation(
        () => queryBuilder as unknown as SelectQueryBuilder<BlogEntity>,
      );

    const result = await repository.getMany({
      pagination: { skip: 0, limit: 10 },
    });

    expect(result.count).toBe(2);
    expect(result.edges).toBe(expectedBlogs);
  });

  it('should return list of entities with sorting', async () => {
    const techBlog = new BlogEntity();
    const musicBlog = new BlogEntity();
    const expectedBlogs = [techBlog, musicBlog];

    const queryBuilder = createQueryBuilderMock();
    queryBuilder.getMany.mockReturnValue(expectedBlogs);
    queryBuilder.getCount.mockReturnValue(2);

    jest.spyOn(repository, 'metadata', 'get').mockReturnValue({
      givenTableName: 'blog',
    } as any);
    jest
      .spyOn(repository, 'createQueryBuilder')
      .mockImplementation(
        () => queryBuilder as unknown as SelectQueryBuilder<BlogEntity>,
      );

    const result = await repository.getMany({
      pagination: { skip: 0, limit: 10 },
      sorting: {
        order: OrderEnum.asc,
        field: 'createdAt',
      },
    });

    expect(result.count).toBe(2);
    expect(result.edges).toBe(expectedBlogs);
  });
});
