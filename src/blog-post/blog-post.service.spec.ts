import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  MockType,
  createQueryBuilderMock,
  repositoryMockFactory,
} from 'src/utils/testing';
import { BlogService } from 'src/blog/blog.service';
import { BlogEntity } from 'src/blog/blog.entity';
import { UserEntity } from 'src/user/user.entity';
import { UserRoleEnum } from 'src/user/user.interface';
import { BlogPostService } from './blog-post.service';
import { BlogPostEntity } from './blog-post.entity';
import { BlogPostsOrderByEnum } from './blog-post.interface';

describe('BlogPostService', () => {
  let service: BlogPostService;
  let repositoryMock: MockType<Repository<BlogPostEntity>>;
  let blogPost: BlogPostEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogPostService,
        BlogService,
        {
          provide: getRepositoryToken(BlogPostEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(BlogEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<BlogPostService>(BlogPostService);
    repositoryMock = module.get(getRepositoryToken(BlogPostEntity));
  });

  it('should find blog post', async () => {
    const blogPostId = 1000;
    const blogPost = new BlogPostEntity();
    blogPost.id = blogPostId;
    repositoryMock.findOne.mockReturnValue(blogPost);

    const result = await service.findOne(blogPostId);
    expect(result).toEqual(blogPost);
  });

  it('should not find blog post', async () => {
    const blogPostId = 1000;
    repositoryMock.findOne.mockReturnValue(undefined);

    try {
      await service.findOne(blogPostId);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });

  it('should return list of blog posts', async () => {
    const firstBlogPost = new BlogPostEntity();
    const secondBlogPost = new BlogPostEntity();
    const expectedBlogPosts = [firstBlogPost, secondBlogPost];

    const createQueryBuilder = createQueryBuilderMock();
    createQueryBuilder.getMany.mockReturnValue(expectedBlogPosts);
    createQueryBuilder.getCount.mockReturnValue(2);

    repositoryMock.createQueryBuilder.mockReturnValue(createQueryBuilder);

    const result = await service.findAll({ skip: 0, limit: 10 });

    expect(result.count).toBe(2);
    expect(result.edges).toBe(expectedBlogPosts);
  });

  it('should return list of blog posts by writerId', async () => {
    const writer = new UserEntity();
    writer.id = 1;
    const blogPost = new BlogPostEntity();
    blogPost.writer = writer;

    const expectedBlogPosts = [blogPost];

    const createQueryBuilder = createQueryBuilderMock();
    createQueryBuilder.getMany.mockReturnValue(expectedBlogPosts);
    createQueryBuilder.getCount.mockReturnValue(1);

    repositoryMock.createQueryBuilder.mockReturnValue(createQueryBuilder);

    const result = await service.findAll({
      skip: 0,
      limit: 10,
      filter: { writerId: writer.id },
    });

    expect(result.count).toBe(1);
    expect(result.edges).toBe(expectedBlogPosts);
  });

  it('should return list of blog posts by blogId', async () => {
    const blog = new BlogEntity();
    blog.id = 1;
    const blogPost = new BlogPostEntity();
    blogPost.blog = blog;

    const expectedBlogPosts = [blogPost];

    const createQueryBuilder = createQueryBuilderMock();
    createQueryBuilder.getMany.mockReturnValue(expectedBlogPosts);
    createQueryBuilder.getCount.mockReturnValue(1);

    repositoryMock.createQueryBuilder.mockReturnValue(createQueryBuilder);

    const result = await service.findAll({
      skip: 0,
      limit: 10,
      filter: { blogId: blog.id },
    });

    expect(result.count).toBe(1);
    expect(result.edges).toBe(expectedBlogPosts);
  });

  it('should return list of blog posts with sorting by createdAt (ASC)', async () => {
    const firstBlogPost = new BlogPostEntity();
    const secondBlogPost = new BlogPostEntity();
    const expectedBlogPosts = [firstBlogPost, secondBlogPost];

    const createQueryBuilder = createQueryBuilderMock();
    createQueryBuilder.getMany.mockReturnValue(expectedBlogPosts);
    createQueryBuilder.getCount.mockReturnValue(2);

    repositoryMock.createQueryBuilder.mockReturnValue(createQueryBuilder);

    const result = await service.findAll({
      skip: 0,
      limit: 10,
      orderBy: BlogPostsOrderByEnum.createdAtAsc,
    });

    expect(result.count).toBe(2);
    expect(result.edges).toBe(expectedBlogPosts);
  });

  it('should return list of blog posts with sorting by createdAt (DESC)', async () => {
    const firstBlogPost = new BlogPostEntity();
    const secondBlogPost = new BlogPostEntity();
    const expectedBlogPosts = [firstBlogPost, secondBlogPost];

    const createQueryBuilder = createQueryBuilderMock();
    createQueryBuilder.getMany.mockReturnValue(expectedBlogPosts);
    createQueryBuilder.getCount.mockReturnValue(2);

    repositoryMock.createQueryBuilder.mockReturnValue(createQueryBuilder);

    const result = await service.findAll({
      skip: 0,
      limit: 10,
      orderBy: BlogPostsOrderByEnum.createdAtDesc,
    });

    expect(result.count).toBe(2);
    expect(result.edges).toBe(expectedBlogPosts);
  });

  it('should return list of blog posts with sorting by title (ASC)', async () => {
    const firstBlogPost = new BlogPostEntity();
    const secondBlogPost = new BlogPostEntity();
    const expectedBlogPosts = [firstBlogPost, secondBlogPost];

    const createQueryBuilder = createQueryBuilderMock();
    createQueryBuilder.getMany.mockReturnValue(expectedBlogPosts);
    createQueryBuilder.getCount.mockReturnValue(2);

    repositoryMock.createQueryBuilder.mockReturnValue(createQueryBuilder);

    const result = await service.findAll({
      skip: 0,
      limit: 10,
      orderBy: BlogPostsOrderByEnum.titleAsc,
    });

    expect(result.count).toBe(2);
    expect(result.edges).toBe(expectedBlogPosts);
  });

  it('should return list of blog posts with sorting by title (DESC)', async () => {
    const firstBlogPost = new BlogPostEntity();
    const secondBlogPost = new BlogPostEntity();
    const expectedBlogPosts = [firstBlogPost, secondBlogPost];

    const createQueryBuilder = createQueryBuilderMock();
    createQueryBuilder.getMany.mockReturnValue(expectedBlogPosts);
    createQueryBuilder.getCount.mockReturnValue(2);

    repositoryMock.createQueryBuilder.mockReturnValue(createQueryBuilder);

    const result = await service.findAll({
      skip: 0,
      limit: 10,
      orderBy: BlogPostsOrderByEnum.titleDesc,
    });

    expect(result.count).toBe(2);
    expect(result.edges).toBe(expectedBlogPosts);
  });

  it('should create blog post', async () => {
    const writer = new UserEntity();
    writer.id = 1;
    const blog = new BlogEntity();
    blog.id = 1;
    const blogPostData = {
      blogId: blog.id,
      title: 'Test Blog Post',
      content: 'content',
    };
    const newBlogPost = new BlogPostEntity();
    Object.assign(newBlogPost, blogPostData);
    newBlogPost.id = 1;
    newBlogPost.blog = blog;
    newBlogPost.writer = writer;

    repositoryMock.save.mockReturnValue(newBlogPost);

    blogPost = await service.create(writer, blogPostData);

    expect(blogPost).toBeInstanceOf(BlogPostEntity);
    expect(blogPost).toHaveProperty('writer');
    expect(blogPost).toHaveProperty('blog');
    expect(repositoryMock.create).toHaveBeenCalledWith(blogPostData);
  });

  it('should update blog post', async () => {
    const writer = new UserEntity();
    const newBlogPostData = {
      title: 'Test Updated Blog Post',
      content: 'updated content',
    };

    Object.assign(blogPost, newBlogPostData);
    repositoryMock.save.mockReturnValue(blogPost);

    const result = await service.update(writer, blogPost.id, newBlogPostData);

    expect(result).toBeInstanceOf(BlogPostEntity);
    expect(result.title).toEqual(newBlogPostData.title);
    expect(result.content).toEqual(newBlogPostData.content);
  });

  it('should not update blog post', async () => {
    const anotherWriter = new UserEntity();
    anotherWriter.id = 2;
    anotherWriter.role = UserRoleEnum.writer;

    const newBlogPostData = {
      title: 'Test Updated Blog Post',
      content: 'updated content',
    };

    jest.spyOn(service, 'findOne').mockImplementation(async () => blogPost);

    try {
      await service.update(anotherWriter, blogPost.id, newBlogPostData);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenException);
    }
  });

  it('should remove blog post', async () => {
    const writer = new UserEntity();

    repositoryMock.remove.mockReturnValue(blogPost);
    const result = await service.remove(writer, blogPost.id);

    expect(result.id).toEqual(blogPost.id);
  });

  it('should not remove blog post', async () => {
    const anotherWriter = new UserEntity();
    anotherWriter.id = 2;
    anotherWriter.role = UserRoleEnum.writer;

    jest.spyOn(service, 'findOne').mockImplementation(async () => blogPost);

    try {
      await service.remove(anotherWriter, blogPost.id);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenException);
    }
  });
});
