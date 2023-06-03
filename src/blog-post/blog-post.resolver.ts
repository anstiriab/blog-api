import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ParseIntPipe } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { User } from 'src/auth/user.decorator';
import { UserRoleEnum } from 'src/user/user.interface';
import { UserEntity } from 'src/user/user.entity';
import { BlogPostService } from './blog-post.service';
import { BlogService } from 'src/blog/blog.service';
import { UserService } from 'src/user/user.service';
import {
  BlogPostOutput,
  CreateBlogPostInput,
  GetManyBlogPostArgs,
  PaginatedBlogPostOutput,
  UpdateBlogPostInput,
} from './dto';

@Resolver(() => BlogPostOutput)
export class BlogPostResolver {
  constructor(
    private readonly blogPostService: BlogPostService,
    private readonly blogService: BlogService,
    private readonly userService: UserService,
  ) {}

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

  @ResolveField()
  async blog(@Parent() blogPost) {
    const { blogId } = blogPost;
    return this.blogService.getBlog(blogId);
  }

  @ResolveField()
  async writer(@Parent() blogPost) {
    const { writerId } = blogPost;
    return this.userService.getUser(writerId);
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
