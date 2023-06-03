import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ParseIntPipe } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/user/user.entity';
import { UserRoleEnum } from 'src/user/user.interface';
import { BlogService } from './blog.service';
import {
  BlogOutput,
  CreateBlogInput,
  UpdateBlogInput,
  GetManyBlogsArgs,
  PaginatedBlogOutput,
} from './dto';

@Resolver(() => BlogOutput)
export class BlogResolver {
  constructor(private readonly blogService: BlogService) {}

  @Query(() => PaginatedBlogOutput, { name: 'blogs' })
  getBlogs(@Args() args: GetManyBlogsArgs) {
    const { skip, limit } = args;
    return this.blogService.getBlogs({ ...args, pagination: { skip, limit } });
  }

  @Query(() => BlogOutput, { name: 'blog' })
  getBlog(@Args('id', { type: () => Int }, ParseIntPipe) id: number) {
    return this.blogService.getBlog(id);
  }

  @Mutation(() => BlogOutput)
  @Roles(UserRoleEnum.writer)
  createBlog(@User() user: UserEntity, @Args('input') input: CreateBlogInput) {
    return this.blogService.createBlog(user, input);
  }

  @Mutation(() => BlogOutput)
  @Roles(UserRoleEnum.writer, UserRoleEnum.moderator)
  updateBlog(
    @User() user: UserEntity,
    @Args('id', { type: () => Int }, ParseIntPipe) id: number,
    @Args('input') input: UpdateBlogInput,
  ) {
    return this.blogService.updateBlog(user, id, input);
  }

  @Mutation(() => BlogOutput)
  @Roles(UserRoleEnum.writer, UserRoleEnum.moderator)
  removeBlog(
    @User() user: UserEntity,
    @Args('id', { type: () => Int }, ParseIntPipe) id: number,
  ) {
    return this.blogService.removeBlog(user, id);
  }
}
