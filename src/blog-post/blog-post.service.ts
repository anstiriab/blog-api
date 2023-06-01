import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedTypeI } from 'src/common/baseEntity/base.interface';
import { UserEntity } from 'src/user/user.entity';
import { UserRoleEnum } from 'src/user/user.interface';
import { BlogService } from 'src/blog/blog.service';
import { BlogPostEntity } from './blog-post.entity';
import { BlogPostsOrderByEnum, GetBlogPostsArgsI } from './blog-post.interface';
import { CreateBlogPostInput, UpdateBlogPostInput } from './dto';

@Injectable()
export class BlogPostService {
  constructor(
    @InjectRepository(BlogPostEntity)
    private blogPostRepository: Repository<BlogPostEntity>,
    private blogService: BlogService,
  ) {}

  async findAll(
    args: GetBlogPostsArgsI,
  ): Promise<PaginatedTypeI<BlogPostEntity>> {
    const { filter, orderBy, skip, limit } = args;
    const queryBuilder = this.blogPostRepository
      .createQueryBuilder('blog_post')
      .leftJoinAndSelect('blog_post.blog', 'blog')
      .leftJoinAndSelect('blog_post.writer', 'user')
      .leftJoinAndSelect('blog.writer', 'blog_user')
      .where('true');

    if (filter?.blogId) {
      queryBuilder.andWhere('blog_post.blogId = :blogId', {
        blogId: filter.blogId,
      });
    }

    if (filter?.writerId) {
      queryBuilder.andWhere('blog_post.writerId = :writerId', {
        writerId: filter.writerId,
      });
    }

    if (orderBy) {
      if (orderBy === BlogPostsOrderByEnum.titleAsc) {
        queryBuilder.orderBy('blog_post.title', 'ASC');
      } else if (orderBy === BlogPostsOrderByEnum.titleDesc) {
        queryBuilder.orderBy('blog_post.title', 'DESC');
      } else if (orderBy === BlogPostsOrderByEnum.createdAtAsc) {
        queryBuilder.orderBy('blog_post.createdAt', 'ASC');
      } else {
        queryBuilder.orderBy('blog_post.createdAt', 'DESC');
      }
    } else {
      queryBuilder.orderBy('blog_post.createdAt', 'DESC');
    }

    const count = await queryBuilder.getCount();
    queryBuilder.skip(skip);
    queryBuilder.take(limit);

    const posts = await queryBuilder.getMany();

    return { count, edges: posts };
  }

  async findOne(id: number): Promise<BlogPostEntity> {
    const post = await this.blogPostRepository.findOne({
      where: { id },
      relations: { blog: { writer: true }, writer: true },
    });
    if (!post) {
      throw new NotFoundException('Blog post not found');
    }
    return post;
  }

  async create(
    user: UserEntity,
    input: CreateBlogPostInput,
  ): Promise<BlogPostEntity> {
    const blog = await this.blogService.findOne(input.blogId);

    const post = await this.blogPostRepository.create(input);
    post.blog = blog;
    post.writer = user;

    const newPost = await this.blogPostRepository.save(post);
    return newPost;
  }

  async update(
    user: UserEntity,
    id: number,
    input: UpdateBlogPostInput,
  ): Promise<BlogPostEntity> {
    const post = await this.findOne(id);
    if (!this.checkAbility(user, post)) {
      throw new ForbiddenException();
    }

    const updatedPost = Object.assign(post, input);
    const savedPost = await this.blogPostRepository.save(updatedPost);

    return savedPost;
  }

  async remove(user: UserEntity, id: number): Promise<BlogPostEntity> {
    const post = await this.findOne(id);
    if (!this.checkAbility(user, post)) {
      throw new ForbiddenException();
    }

    const deletedPost = await this.blogPostRepository.remove(post);
    deletedPost.id = id;

    return deletedPost;
  }

  private checkAbility(user: UserEntity, blogPost: BlogPostEntity): boolean {
    if (user.role === UserRoleEnum.writer && blogPost.writer.id !== user.id) {
      return false;
    }
    return true;
  }
}
