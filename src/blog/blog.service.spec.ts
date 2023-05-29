import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  MockType,
  createQueryBuilderMock,
  repositoryMockFactory,
} from 'src/utils/testing';
import { BlogService } from './blog.service';
import { BlogEntity } from './blog.entity';
import { UserEntity } from 'src/user/user.entity';
import { BlogsOrderByEnum } from './blog.interface';
import { UserRoleEnum } from 'src/user/user.interface';

describe('BlogService', () => {
  let service: BlogService;
  let repositoryMock: MockType<Repository<BlogEntity>>;
  let blog: BlogEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        {
          provide: getRepositoryToken(BlogEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<BlogService>(BlogService);
    repositoryMock = module.get(getRepositoryToken(BlogEntity));
  });

  it('should find blog', async () => {
    const blogId = 1000;
    const blog = new BlogEntity();
    blog.id = blogId;
    repositoryMock.findOne.mockReturnValue(blog);

    const result = await service.findOne(blogId);
    expect(result).toEqual(blog);
  });

  it('should not find blog', async () => {
    const blogId = 1000;
    repositoryMock.findOne.mockReturnValue(undefined);

    try {
      await service.findOne(blogId);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });

  it('should return list of blogs', async () => {
    const techBlog = new BlogEntity();
    const musicBlog = new BlogEntity();
    const expectedBlogs = [techBlog, musicBlog];

    const createQueryBuilder = createQueryBuilderMock();
    createQueryBuilder.getMany.mockReturnValue(expectedBlogs);
    createQueryBuilder.getCount.mockReturnValue(2);

    repositoryMock.createQueryBuilder.mockReturnValue(createQueryBuilder);

    const result = await service.findAll({ skip: 0, limit: 10 });

    expect(result.count).toBe(2);
    expect(result.edges).toBe(expectedBlogs);
  });

  it('should return list of blogs by writerId', async () => {
    const writer = new UserEntity();
    writer.id = 1;
    const techBlog = new BlogEntity();
    techBlog.writer = writer;

    const expectedBlogs = [techBlog];

    const createQueryBuilder = createQueryBuilderMock();
    createQueryBuilder.getMany.mockReturnValue(expectedBlogs);
    createQueryBuilder.getCount.mockReturnValue(1);

    repositoryMock.createQueryBuilder.mockReturnValue(createQueryBuilder);

    const result = await service.findAll({
      skip: 0,
      limit: 10,
      filter: { writerId: writer.id },
    });

    expect(result.count).toBe(1);
    expect(result.edges).toBe(expectedBlogs);
  });

  it('should return list of blogs with sorting', async () => {
    const techBlog = new BlogEntity();
    const musicBlog = new BlogEntity();
    const expectedBlogs = [techBlog, musicBlog];

    const createQueryBuilder = createQueryBuilderMock();
    createQueryBuilder.getMany.mockReturnValue(expectedBlogs);
    createQueryBuilder.getCount.mockReturnValue(2);

    repositoryMock.createQueryBuilder.mockReturnValue(createQueryBuilder);

    const result = await service.findAll({
      skip: 0,
      limit: 10,
      orderBy: BlogsOrderByEnum.createdAtAsc,
    });

    expect(result.count).toBe(2);
    expect(result.edges).toBe(expectedBlogs);
  });

  it('should create blog', async () => {
    const writer = new UserEntity();
    writer.id = 1;
    const blogData = {
      title: 'Test Blog',
      description: 'description',
    };
    const newBlog = new BlogEntity();
    Object.assign(newBlog, blogData);
    newBlog.id = 1;
    newBlog.writer = writer;

    repositoryMock.save.mockReturnValue(newBlog);

    blog = await service.create(writer, blogData);

    expect(blog).toBeInstanceOf(BlogEntity);
    expect(blog).toHaveProperty('writer');
    expect(repositoryMock.create).toHaveBeenCalledWith(blogData);
  });

  it('should update blog', async () => {
    const writer = new UserEntity();
    const newBlogData = {
      title: 'Test Updated Blog',
      description: 'updated description',
    };

    Object.assign(blog, newBlogData);
    repositoryMock.save.mockReturnValue(blog);

    const result = await service.update(writer, blog.id, newBlogData);

    expect(result).toBeInstanceOf(BlogEntity);
    expect(result.title).toEqual(newBlogData.title);
    expect(result.description).toEqual(newBlogData.description);
  });

  it('should not update blog', async () => {
    const anotherWriter = new UserEntity();
    anotherWriter.id = 2;
    anotherWriter.role = UserRoleEnum.writer;

    const newBlogData = {
      title: 'Test Updated Blog',
      description: 'updated description',
    };

    jest.spyOn(service, 'findOne').mockImplementation(async () => blog);

    try {
      await service.update(anotherWriter, blog.id, newBlogData);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenException);
    }
  });

  it('should remove blog', async () => {
    const writer = new UserEntity();

    repositoryMock.remove.mockReturnValue(blog);
    const result = await service.remove(writer, blog.id);

    expect(result.id).toEqual(blog.id);
  });

  it('should not remove blog', async () => {
    const anotherWriter = new UserEntity();
    anotherWriter.id = 2;
    anotherWriter.role = UserRoleEnum.writer;

    jest.spyOn(service, 'findOne').mockImplementation(async () => blog);

    try {
      await service.remove(anotherWriter, blog.id);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenException);
    }
  });
});
