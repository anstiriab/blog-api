import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/baseEntity/base.repository';
import { PaginatedTypeI } from 'src/common/baseEntity/base.interface';
import {
  GetManyBlogsArgsT,
  GetOneBlogIdentifierT,
  BlogRepositoryI,
  CreateBlogT,
  UpdateBlogT,
} from './blog.interface';
import { BlogEntity } from './blog.entity';

@Injectable()
export class BlogRepository
  extends BaseRepository<BlogEntity, GetOneBlogIdentifierT, GetManyBlogsArgsT>
  implements BlogRepositoryI
{
  constructor(private dataSource: DataSource) {
    super(BlogEntity, dataSource.createEntityManager());
  }

  async getMany(args: GetManyBlogsArgsT): Promise<PaginatedTypeI<BlogEntity>> {
    const tableName = 'blog';
    const queryBuilder = this.createQueryBuilder(tableName);

    const { filter } = args;
    if (filter?.writerId) {
      queryBuilder.where('blog.writerId = :writerId', {
        writerId: filter.writerId,
      });
    }

    const result = await super.getMany(args, queryBuilder);
    return result;
  }

  async createOne(input: CreateBlogT): Promise<BlogEntity> {
    const blog = await this.create(input);
    const newBlog = await this.save(blog);
    return newBlog;
  }

  async updateOne(blog: BlogEntity, input: UpdateBlogT): Promise<BlogEntity> {
    const updatedBlog = Object.assign(blog, input);
    const savedBlog = await this.save(updatedBlog);
    return savedBlog;
  }

  async removeOne(blog: BlogEntity): Promise<BlogEntity> {
    const id = blog.id;
    const deletedBlog = await this.remove(blog);
    deletedBlog.id = id;
    return deletedBlog;
  }
}
