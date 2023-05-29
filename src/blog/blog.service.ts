import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedTypeI } from 'src/common/pagination/pagination.output';
import { UserEntity } from 'src/user/user.entity';
import { UserRoleEnum } from 'src/user/user.interface';
import { BlogsOrderByEnum, GetBlogsArgsI } from './blog.interface';
import { BlogEntity } from './blog.entity';
import { CreateBlogInput, UpdateBlogInput } from './dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
  ) {}

  async findAll(args: GetBlogsArgsI): Promise<PaginatedTypeI<BlogEntity>> {
    const { filter, orderBy, skip, limit } = args;
    const queryBuilder = this.blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.writer', 'user');

    if (filter?.writerId) {
      queryBuilder.where('blog.writerId = :writerId', {
        writerId: filter.writerId,
      });
    }

    if (orderBy && orderBy === BlogsOrderByEnum.createdAtAsc) {
      queryBuilder.orderBy('blog.createdAt', 'ASC');
    } else {
      queryBuilder.orderBy('blog.createdAt', 'DESC');
    }

    const count = await queryBuilder.getCount();
    queryBuilder.skip(skip);
    queryBuilder.take(limit);

    const blogs = await queryBuilder.getMany();

    return { count, edges: blogs };
  }

  async findOne(id: number): Promise<BlogEntity> {
    const blog = await this.blogRepository.findOne({
      where: { id },
      relations: { writer: true },
    });
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return blog;
  }

  async create(user: UserEntity, input: CreateBlogInput): Promise<BlogEntity> {
    const blog = await this.blogRepository.create(input);
    blog.writer = user;

    const newBlog = await this.blogRepository.save(blog);
    return newBlog;
  }

  async update(
    user: UserEntity,
    id: number,
    input: UpdateBlogInput,
  ): Promise<BlogEntity> {
    const blog = await this.findOne(id);
    if (!this.checkAbility(user, blog)) {
      throw new ForbiddenException();
    }

    const updatedBlog = Object.assign(blog, input);
    const savedBlog = await this.blogRepository.save(updatedBlog);

    return savedBlog;
  }

  async remove(user: UserEntity, id: number): Promise<BlogEntity> {
    const blog = await this.findOne(id);
    if (!this.checkAbility(user, blog)) {
      throw new ForbiddenException();
    }

    const deletedBlog = await this.blogRepository.remove(blog);
    deletedBlog.id = id;

    return deletedBlog;
  }

  checkAbility(user: UserEntity, blog: BlogEntity): boolean {
    if (user.role === UserRoleEnum.writer && blog.writer.id !== user.id) {
      return false;
    }
    return true;
  }
}
