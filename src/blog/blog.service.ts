import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PaginatedTypeI } from 'src/common/baseEntity/base.interface';
import { UserEntity } from 'src/user/user.entity';
import { UserRoleEnum } from 'src/user/user.interface';
import { BlogI, BlogRepositoryI, GetManyBlogsArgsT } from './blog.interface';
import { CreateBlogInput, UpdateBlogInput } from './dto';
import { BLOG_REPOSITORY_TOKEN } from './blog.constants';

@Injectable()
export class BlogService {
  constructor(
    @Inject(BLOG_REPOSITORY_TOKEN)
    private blogRepository: BlogRepositoryI,
  ) {}

  async getBlog(id: number): Promise<BlogI> {
    const blog = await this.blogRepository.getOne(
      { id },
      { isThrowException: true },
    );
    return blog;
  }

  async getBlogs(args: GetManyBlogsArgsT): Promise<PaginatedTypeI<BlogI>> {
    const result = await this.blogRepository.getMany(args);
    return result;
  }

  async createBlog(user: UserEntity, input: CreateBlogInput): Promise<BlogI> {
    const newBlog = await this.blogRepository.createOne({
      ...input,
      writer: user,
    });
    return newBlog;
  }

  async updateBlog(
    user: UserEntity,
    id: number,
    input: UpdateBlogInput,
  ): Promise<BlogI> {
    const blog = await this.getBlog(id);
    if (!this.checkAbility(user, blog)) {
      throw new ForbiddenException();
    }

    const savedBlog = await this.blogRepository.updateOne(blog, input);
    return savedBlog;
  }

  async removeBlog(user: UserEntity, id: number): Promise<BlogI> {
    const blog = await this.getBlog(id);
    if (!this.checkAbility(user, blog)) {
      throw new ForbiddenException();
    }

    const deletedBlog = await this.blogRepository.removeOne(blog);
    return deletedBlog;
  }

  private checkAbility(user: UserEntity, blog: BlogI): boolean {
    if (user.role === UserRoleEnum.writer && blog.writerId !== user.id) {
      return false;
    }
    return true;
  }
}
