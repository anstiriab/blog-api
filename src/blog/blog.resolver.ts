import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Roles } from 'src/auth/roles.decorator';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/user/user.entity';
import { UserRoleEnum } from 'src/user/user.interface';
import { BlogService } from './blog.service';
import {
  BlogOutput,
  CreateBlogInput,
  UpdateBlogInput,
  GetBlogsArgs,
  PaginatedBlogOutput,
} from './dto';

@Resolver(() => BlogOutput)
export class BlogResolver {
  constructor(private readonly blogService: BlogService) {}

  @Query(() => PaginatedBlogOutput, { name: 'blogs' })
  findAll(@Args() args: GetBlogsArgs) {
    return this.blogService.findAll(args);
  }

  @Query(() => BlogOutput, { name: 'blog' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.blogService.findOne(id);
  }

  @Mutation(() => BlogOutput)
  @Roles(UserRoleEnum.writer)
  createBlog(@User() user: UserEntity, @Args('input') input: CreateBlogInput) {
    return this.blogService.create(user, input);
  }

  @Mutation(() => BlogOutput)
  @Roles(UserRoleEnum.writer, UserRoleEnum.moderator)
  updateBlog(
    @User() user: UserEntity,
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateBlogInput,
  ) {
    return this.blogService.update(user, id, input);
  }

  @Mutation(() => BlogOutput)
  @Roles(UserRoleEnum.writer, UserRoleEnum.moderator)
  removeBlog(
    @User() user: UserEntity,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.blogService.remove(user, id);
  }
}
