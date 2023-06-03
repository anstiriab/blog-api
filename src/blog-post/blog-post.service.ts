import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PaginatedTypeI } from 'src/common/baseEntity/base.interface';
import { UserEntity } from 'src/user/user.entity';
import { UserRoleEnum } from 'src/user/user.interface';
import { BlogService } from 'src/blog/blog.service';
import {
  BlogPostI,
  BlogPostRepositoryI,
  GetManyBlogPostsArgsT,
} from './blog-post.interface';
import { CreateBlogPostInput, UpdateBlogPostInput } from './dto';
import { BLOG_POST_REPOSITORY_TOKEN } from './blog-post.constants';

@Injectable()
export class BlogPostService {
  constructor(
    @Inject(BLOG_POST_REPOSITORY_TOKEN)
    private blogPostRepository: BlogPostRepositoryI,
    private blogService: BlogService,
  ) {}

  async getBlogPost(id: number): Promise<BlogPostI> {
    const post = await this.blogPostRepository.getOne(
      { id },
      { isThrowException: true },
    );
    return post;
  }

  async getBlogPosts(
    args: GetManyBlogPostsArgsT,
  ): Promise<PaginatedTypeI<BlogPostI>> {
    const result = await this.blogPostRepository.getMany(args);
    return result;
  }

  async createBlogPost(
    user: UserEntity,
    input: CreateBlogPostInput,
  ): Promise<BlogPostI> {
    const blog = await this.blogService.getBlog(input.blogId);

    const newPost = await this.blogPostRepository.createOne({
      ...input,
      blog,
      writer: user,
    });

    return newPost;
  }

  async updateBlogPost(
    user: UserEntity,
    id: number,
    input: UpdateBlogPostInput,
  ): Promise<BlogPostI> {
    const post = await this.getBlogPost(id);
    if (!this.checkAbility(user, post)) {
      throw new ForbiddenException();
    }

    const savedPost = await this.blogPostRepository.updateOne(post, input);
    return savedPost;
  }

  async removeBlogPost(user: UserEntity, id: number): Promise<BlogPostI> {
    const post = await this.getBlogPost(id);
    if (!this.checkAbility(user, post)) {
      throw new ForbiddenException();
    }

    const deletedPost = await this.blogPostRepository.removeOne(post);
    return deletedPost;
  }

  private checkAbility(user: UserEntity, blogPost: BlogPostI): boolean {
    if (user.role === UserRoleEnum.writer && blogPost.writerId !== user.id) {
      return false;
    }
    return true;
  }
}
