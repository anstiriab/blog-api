import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/baseEntity/base.repository';
import { PaginatedTypeI } from 'src/common/baseEntity/base.interface';
import {
  GetManyBlogPostsArgsT,
  GetOneBlogPostIdentifierT,
  BlogPostRepositoryI,
  CreateBlogPostT,
  UpdateBlogPostT,
} from './blog-post.interface';
import { BlogPostEntity } from './blog-post.entity';

@Injectable()
export class BlogPostRepository
  extends BaseRepository<
    BlogPostEntity,
    GetOneBlogPostIdentifierT,
    GetManyBlogPostsArgsT
  >
  implements BlogPostRepositoryI
{
  constructor(private dataSource: DataSource) {
    super(BlogPostEntity, dataSource.createEntityManager());
  }

  async getMany(
    args: GetManyBlogPostsArgsT,
  ): Promise<PaginatedTypeI<BlogPostEntity>> {
    const tableName = 'blog_post';
    const queryBuilder = this.createQueryBuilder(tableName);

    const { filter } = args;
    if (filter?.writerId) {
      queryBuilder.where('blog_post.writerId = :writerId', {
        writerId: filter.writerId,
      });
    }
    if (filter?.blogId) {
      queryBuilder.andWhere('blog_post.blogId = :blogId', {
        blogId: filter.blogId,
      });
    }

    const result = await super.getMany(args, queryBuilder);
    return result;
  }

  async createOne(input: CreateBlogPostT): Promise<BlogPostEntity> {
    const blogPost = await this.create(input);
    const newBlogPost = await this.save(blogPost);
    return newBlogPost;
  }

  async updateOne(
    blogPost: BlogPostEntity,
    input: UpdateBlogPostT,
  ): Promise<BlogPostEntity> {
    const updatedBlogPost = Object.assign(blogPost, input);
    const savedBlogPost = await this.save(updatedBlogPost);
    return savedBlogPost;
  }

  async removeOne(blogPost: BlogPostEntity): Promise<BlogPostEntity> {
    const id = blogPost.id;
    const deletedBlogPost = await this.remove(blogPost);
    deletedBlogPost.id = id;
    return deletedBlogPost;
  }
}
