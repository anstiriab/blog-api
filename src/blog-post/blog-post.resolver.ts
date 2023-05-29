import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Roles } from 'src/auth/roles.decorator';
import { User } from 'src/auth/user.decorator';
import { UserRoleEnum } from 'src/user/user.interface';
import { UserEntity } from 'src/user/user.entity';
import { BlogPostService } from './blog-post.service';
import {
  BlogPostOutput,
  CreateBlogPostInput,
  GetBlogPostsArgs,
  PaginatedBlogPostOutput,
  UpdateBlogPostInput,
} from './dto';

@Resolver(() => BlogPostOutput)
export class BlogPostResolver {
  constructor(private readonly blogPostService: BlogPostService) {}

  @Query(() => PaginatedBlogPostOutput, { name: 'blogPosts' })
  findAll(@Args() args: GetBlogPostsArgs) {
    return this.blogPostService.findAll(args);
  }

  @Query(() => BlogPostOutput, { name: 'blogPost' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.blogPostService.findOne(id);
  }

  @Mutation(() => BlogPostOutput)
  @Roles(UserRoleEnum.writer)
  createBlogPost(
    @User() user: UserEntity,
    @Args('input') input: CreateBlogPostInput,
  ) {
    return this.blogPostService.create(user, input);
  }

  @Mutation(() => BlogPostOutput)
  @Roles(UserRoleEnum.writer, UserRoleEnum.moderator)
  updateBlogPost(
    @User() user: UserEntity,
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateBlogPostInput,
  ) {
    return this.blogPostService.update(user, id, input);
  }

  @Mutation(() => BlogPostOutput)
  @Roles(UserRoleEnum.writer, UserRoleEnum.moderator)
  removeBlogPost(
    @User() user: UserEntity,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.blogPostService.remove(user, id);
  }
}
