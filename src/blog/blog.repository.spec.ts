import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { SelectQueryBuilder } from 'typeorm';
import {
  createQueryBuilderMock,
  dataSourceMockFactory,
} from 'src/utils/testing';
import { BlogEntity } from './blog.entity';
import { UserEntity } from 'src/user/user.entity';
import { BlogRepository } from './blog.repository';

describe('BlogRepository', () => {
  let repository: BlogRepository;
  let blog: BlogEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogRepository,
        {
          provide: getDataSourceToken(),
          useFactory: dataSourceMockFactory,
        },
      ],
    }).compile();

    repository = module.get<BlogRepository>(BlogRepository);
  });

  it('should return list of blogs', async () => {
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

  it('should return list of blogs by writerId', async () => {
    const writer = new UserEntity();
    writer.id = 1;
    const techBlog = new BlogEntity();
    techBlog.writer = writer;

    const expectedBlogs = [techBlog];

    const queryBuilder = createQueryBuilderMock();
    queryBuilder.getMany.mockReturnValue(expectedBlogs);
    queryBuilder.getCount.mockReturnValue(1);

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
      filter: { writerId: writer.id },
    });

    expect(result.count).toBe(1);
    expect(result.edges).toBe(expectedBlogs);
  });

  it('should create blog', async () => {
    const writer = new UserEntity();
    writer.id = 1;
    const blogData = {
      title: 'Test Blog',
      description: 'description',
      writer,
    };
    const newBlog = new BlogEntity();
    Object.assign(newBlog, blogData);
    newBlog.id = 1;

    jest.spyOn(repository, 'create').mockImplementation(() => newBlog);
    jest.spyOn(repository, 'save').mockImplementation(async () => newBlog);

    const result = await repository.createOne(blogData);
    if (result) blog = result;

    expect(blog).toBeInstanceOf(BlogEntity);
    expect(blog).toHaveProperty('writer');
    expect(repository.create).toHaveBeenCalledWith(blogData);
  });

  it('should update blog', async () => {
    const newBlogData = {
      title: 'Test Updated Blog',
      description: 'updated description',
    };

    Object.assign(blog, newBlogData);
    jest.spyOn(repository, 'save').mockImplementation(async () => blog);

    const result = await repository.updateOne(blog, newBlogData);

    expect(result).toBeInstanceOf(BlogEntity);
    expect(result.title).toEqual(newBlogData.title);
    expect(result.description).toEqual(newBlogData.description);
  });

  it('should remove blog', async () => {
    jest.spyOn(repository, 'remove').mockImplementation(async () => blog);

    const result = await repository.removeOne(blog);

    expect(result.id).toEqual(blog.id);
  });
});
