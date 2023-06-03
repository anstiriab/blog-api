import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { MockType, customRepositoryMockFactory } from 'src/utils/testing';
import { BlogService } from 'src/blog/blog.service';
import { BlogEntity } from 'src/blog/blog.entity';
import { UserEntity } from 'src/user/user.entity';
import { UserRoleEnum } from 'src/user/user.interface';
import { BlogPostService } from './blog-post.service';
import { BlogPostEntity } from './blog-post.entity';
import { BlogPostI } from './blog-post.interface';
import { BlogPostRepository } from './blog-post.repository';
import { BLOG_REPOSITORY_TOKEN } from 'src/blog/blog.constants';
import { BLOG_POST_REPOSITORY_TOKEN } from './blog-post.constants';

describe('BlogPostService', () => {
  let service: BlogPostService;
  let customRepositoryMock: MockType<BlogPostRepository>;
  let blogPost: BlogPostI;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogPostService,
        BlogService,
        {
          provide: BLOG_POST_REPOSITORY_TOKEN,
          useFactory: customRepositoryMockFactory,
        },
        {
          provide: BLOG_REPOSITORY_TOKEN,
          useFactory: customRepositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<BlogPostService>(BlogPostService);
    customRepositoryMock = module.get(BLOG_POST_REPOSITORY_TOKEN);
  });

  it('should find blog post', async () => {
    const blogPostId = 1000;
    const blogPost = new BlogPostEntity();
    blogPost.id = blogPostId;
    customRepositoryMock.getOne.mockReturnValue(blogPost);

    const result = await service.getBlogPost(blogPostId);
    expect(result).toEqual(blogPost);
  });

  it('should return list of blog posts', async () => {
    const firstBlogPost = new BlogPostEntity();
    const secondBlogPost = new BlogPostEntity();
    const expectedBlogPosts = [firstBlogPost, secondBlogPost];

    customRepositoryMock.getMany.mockReturnValue({
      count: 2,
      edges: expectedBlogPosts,
    });

    const result = await service.getBlogPosts({
      pagination: { skip: 0, limit: 10 },
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

    customRepositoryMock.createOne.mockReturnValue(newBlogPost);

    blogPost = await service.createBlogPost(writer, blogPostData);

    expect(blogPost).toBeInstanceOf(BlogPostEntity);
    expect(blogPost).toHaveProperty('writer');
    expect(blogPost).toHaveProperty('blog');
    expect(customRepositoryMock.createOne).toHaveBeenCalledWith({
      ...blogPostData,
      writer,
      blog,
    });
  });

  it('should update blog post', async () => {
    const writer = new UserEntity();
    const newBlogPostData = {
      title: 'Test Updated Blog Post',
      content: 'updated content',
    };

    Object.assign(blogPost, newBlogPostData);
    customRepositoryMock.updateOne.mockReturnValue(blogPost);

    const result = await service.updateBlogPost(
      writer,
      blogPost.id,
      newBlogPostData,
    );

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

    jest.spyOn(service, 'getBlogPost').mockImplementation(async () => blogPost);

    try {
      await service.updateBlogPost(anotherWriter, blogPost.id, newBlogPostData);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenException);
    }
  });

  it('should remove blog post', async () => {
    const writer = new UserEntity();

    customRepositoryMock.removeOne.mockReturnValue(blogPost);
    const result = await service.removeBlogPost(writer, blogPost.id);

    expect(result.id).toEqual(blogPost.id);
  });

  it('should not remove blog post', async () => {
    const anotherWriter = new UserEntity();
    anotherWriter.id = 2;
    anotherWriter.role = UserRoleEnum.writer;

    jest.spyOn(service, 'getBlogPost').mockImplementation(async () => blogPost);

    try {
      await service.removeBlogPost(anotherWriter, blogPost.id);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenException);
    }
  });
});
