import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { SelectQueryBuilder } from 'typeorm';
import {
  createQueryBuilderMock,
  dataSourceMockFactory,
} from 'src/utils/testing';
import { BlogPostEntity } from './blog-post.entity';
import { UserEntity } from 'src/user/user.entity';
import { BlogPostRepository } from './blog-post.repository';
import { BlogEntity } from 'src/blog/blog.entity';

describe('BlogPostRepository', () => {
  let repository: BlogPostRepository;
  let blogPost: BlogPostEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogPostRepository,
        {
          provide: getDataSourceToken(),
          useFactory: dataSourceMockFactory,
        },
      ],
    }).compile();

    repository = module.get<BlogPostRepository>(BlogPostRepository);
  });

  it('should return list of blog posts', async () => {
    const techBlogPost = new BlogPostEntity();
    const musicBlogPost = new BlogPostEntity();
    const expectedBlogPosts = [techBlogPost, musicBlogPost];

    const queryBuilder = createQueryBuilderMock();
    queryBuilder.getMany.mockReturnValue(expectedBlogPosts);
    queryBuilder.getCount.mockReturnValue(2);

    jest.spyOn(repository, 'metadata', 'get').mockReturnValue({
      givenTableName: 'blog',
    } as any);
    jest
      .spyOn(repository, 'createQueryBuilder')
      .mockImplementation(
        () => queryBuilder as unknown as SelectQueryBuilder<BlogPostEntity>,
      );

    const result = await repository.getMany({
      pagination: { skip: 0, limit: 10 },
    });

    expect(result.count).toBe(2);
    expect(result.edges).toBe(expectedBlogPosts);
  });

  it('should return list of blog posts by writerId', async () => {
    const writer = new UserEntity();
    writer.id = 1;
    const techBlogPost = new BlogPostEntity();
    techBlogPost.writer = writer;

    const expectedBlogPosts = [techBlogPost];

    const queryBuilder = createQueryBuilderMock();
    queryBuilder.getMany.mockReturnValue(expectedBlogPosts);
    queryBuilder.getCount.mockReturnValue(1);

    jest.spyOn(repository, 'metadata', 'get').mockReturnValue({
      givenTableName: 'blog_post',
    } as any);
    jest
      .spyOn(repository, 'createQueryBuilder')
      .mockImplementation(
        () => queryBuilder as unknown as SelectQueryBuilder<BlogPostEntity>,
      );

    const result = await repository.getMany({
      pagination: { skip: 0, limit: 10 },
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

    const queryBuilder = createQueryBuilderMock();
    queryBuilder.getMany.mockReturnValue(expectedBlogPosts);
    queryBuilder.getCount.mockReturnValue(1);

    jest.spyOn(repository, 'metadata', 'get').mockReturnValue({
      givenTableName: 'blog_post',
    } as any);
    jest
      .spyOn(repository, 'createQueryBuilder')
      .mockImplementation(
        () => queryBuilder as unknown as SelectQueryBuilder<BlogPostEntity>,
      );

    const result = await repository.getMany({
      pagination: { skip: 0, limit: 10 },
      filter: { blogId: blog.id },
    });

    expect(result.count).toBe(1);
    expect(result.edges).toBe(expectedBlogPosts);
  });

  it('should create blog post', async () => {
    const writer = new UserEntity();
    writer.id = 1;
    const blog = new BlogEntity();
    blog.id = 1;
    const blogPostData = {
      title: 'Test Blog Post',
      content: 'content',
      writer,
      blog,
    };
    const newBlogPost = new BlogPostEntity();
    Object.assign(newBlogPost, blogPostData);
    newBlogPost.id = 1;

    jest.spyOn(repository, 'create').mockImplementation(() => newBlogPost);
    jest.spyOn(repository, 'save').mockImplementation(async () => newBlogPost);

    const result = await repository.createOne(blogPostData);
    if (result) blogPost = result;

    expect(blogPost).toBeInstanceOf(BlogPostEntity);
    expect(blogPost).toHaveProperty('writer');
    expect(repository.create).toHaveBeenCalledWith(blogPostData);
  });

  it('should update blog post', async () => {
    const newBlogPostData = {
      title: 'Test Updated Blog Post',
      content: 'updated content',
    };

    Object.assign(blogPost, newBlogPostData);
    jest.spyOn(repository, 'save').mockImplementation(async () => blogPost);

    const result = await repository.updateOne(blogPost, newBlogPostData);

    expect(result).toBeInstanceOf(BlogPostEntity);
    expect(result.title).toEqual(newBlogPostData.title);
    expect(result.content).toEqual(newBlogPostData.content);
  });

  it('should remove blog post', async () => {
    jest.spyOn(repository, 'remove').mockImplementation(async () => blogPost);

    const result = await repository.removeOne(blogPost);

    expect(result.id).toEqual(blogPost.id);
  });
});
