import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { MockType, customRepositoryMockFactory } from 'src/utils/testing';
import { BlogService } from './blog.service';
import { BlogEntity } from './blog.entity';
import { UserEntity } from 'src/user/user.entity';
import { UserRoleEnum } from 'src/user/user.interface';
import { BlogI } from './blog.interface';
import { BlogRepository } from './blog.repository';
import { BLOG_REPOSITORY_TOKEN } from './blog.constants';

describe('BlogService', () => {
  let service: BlogService;
  let customRepositoryMock: MockType<BlogRepository>;
  let blog: BlogI;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        {
          provide: BLOG_REPOSITORY_TOKEN,
          useFactory: customRepositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<BlogService>(BlogService);
    customRepositoryMock = module.get(BLOG_REPOSITORY_TOKEN);
  });

  it('should find blog', async () => {
    const blogId = 1000;
    const blog = new BlogEntity();
    blog.id = blogId;
    customRepositoryMock.getOne.mockReturnValue(blog);

    const result = await service.getBlog(blogId);
    expect(result).toEqual(blog);
  });

  it('should return list of blogs', async () => {
    const techBlog = new BlogEntity();
    const musicBlog = new BlogEntity();
    const expectedBlogs = [techBlog, musicBlog];

    customRepositoryMock.getMany.mockReturnValue({
      count: 2,
      edges: expectedBlogs,
    });

    const result = await service.getBlogs({
      pagination: { skip: 0, limit: 10 },
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

    customRepositoryMock.createOne.mockReturnValue(newBlog);

    const result = await service.createBlog(writer, blogData);
    if (result) blog = result;

    expect(blog).toBeInstanceOf(BlogEntity);
    expect(blog).toHaveProperty('writer');
    expect(customRepositoryMock.createOne).toHaveBeenCalledWith({
      ...blogData,
      writer,
    });
  });

  it('should update blog', async () => {
    const writer = new UserEntity();
    const newBlogData = {
      title: 'Test Updated Blog',
      description: 'updated description',
    };

    Object.assign(blog, newBlogData);
    customRepositoryMock.updateOne.mockReturnValue(blog);

    const result = await service.updateBlog(writer, blog.id, newBlogData);

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

    jest.spyOn(service, 'getBlog').mockImplementation(async () => blog);

    try {
      await service.updateBlog(anotherWriter, blog.id, newBlogData);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenException);
    }
  });

  it('should remove blog', async () => {
    const writer = new UserEntity();

    customRepositoryMock.removeOne.mockReturnValue(blog);
    const result = await service.removeBlog(writer, blog.id);

    expect(result.id).toEqual(blog.id);
  });

  it('should not remove blog', async () => {
    const anotherWriter = new UserEntity();
    anotherWriter.id = 2;
    anotherWriter.role = UserRoleEnum.writer;

    jest.spyOn(service, 'getBlog').mockImplementation(async () => blog);

    try {
      await service.removeBlog(anotherWriter, blog.id);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenException);
    }
  });
});
