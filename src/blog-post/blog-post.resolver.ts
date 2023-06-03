import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ParseIntPipe } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { User } from 'src/auth/user.decorator';
import { UserRoleEnum } from 'src/user/user.interface';
import { UserEntity } from 'src/user/user.entity';
import { BlogPostService } from './blog-post.service';
import {
  BlogPostOutput,
  CreateBlogPostInput,
  GetManyBlogPostArgs,
  PaginatedBlogPostOutput,
  UpdateBlogPostInput,
} from './dto';

@Resolver(() => BlogPostOutput)
export class BlogPostResolver {
  constructor(private readonly blogPostService: BlogPostService) {}

  @Query(() => PaginatedBlogPostOutput, { name: 'blogPosts' })
  getBlogPosts(@Args() args: GetManyBlogPostArgs) {
    const { skip, limit } = args;
    return this.blogPostService.getBlogPosts({
      ...args,
      pagination: { skip, limit },
    });
  }

  @Query(() => BlogPostOutput, { name: 'blogPost' })
  getBlogPost(@Args('id', { type: () => Int }, ParseIntPipe) id: number) {
    return this.blogPostService.getBlogPost(id);
  }

  @Mutation(() => BlogPostOutput)
  @Roles(UserRoleEnum.writer)
  createBlogPost(
    @User() user: UserEntity,
    @Args('input') input: CreateBlogPostInput,
  ) {
    return this.blogPostService.createBlogPost(user, input);
  }

  @Mutation(() => BlogPostOutput)
  @Roles(UserRoleEnum.writer, UserRoleEnum.moderator)
  updateBlogPost(
    @User() user: UserEntity,
    @Args('id', { type: () => Int }, ParseIntPipe) id: number,
    @Args('input') input: UpdateBlogPostInput,
  ) {
    return this.blogPostService.updateBlogPost(user, id, input);
  }

  @Mutation(() => BlogPostOutput)
  @Roles(UserRoleEnum.writer, UserRoleEnum.moderator)
  removeBlogPost(
    @User() user: UserEntity,
    @Args('id', { type: () => Int }, ParseIntPipe) id: number,
  ) {
    return this.blogPostService.removeBlogPost(user, id);
  }
}
