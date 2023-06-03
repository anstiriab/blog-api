import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ParseIntPipe } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { User } from 'src/auth/user.decorator';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UserRoleEnum } from './user.interface';
import { PaginatedUserOutput } from './dto';
import {
  CreateUserInput,
  GetManyUserArgs,
  UpdateUserInput,
  UserOutput,
} from './dto';

@Resolver(() => UserOutput)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => PaginatedUserOutput, { name: 'users' })
  @Roles(UserRoleEnum.moderator)
  getUsers(@Args() args: GetManyUserArgs) {
    const { skip, limit } = args;
    return this.userService.getUsers({ ...args, pagination: { skip, limit } });
  }

  @Query(() => UserOutput, { name: 'user' })
  @Roles(UserRoleEnum.moderator)
  getUser(@Args('id', { type: () => Int }, ParseIntPipe) id: number) {
    return this.userService.getUser(id);
  }

  @Mutation(() => UserOutput)
  createUser(@Args('input') input: CreateUserInput) {
    return this.userService.createUser(input);
  }

  @Mutation(() => UserOutput)
  @Roles(UserRoleEnum.writer)
  updateUser(@User() user: UserEntity, @Args('input') input: UpdateUserInput) {
    return this.userService.updateUser(user, input);
  }

  @Mutation(() => UserOutput)
  @Roles(UserRoleEnum.writer)
  removeUser(@User() user: UserEntity) {
    return this.userService.removeUser(user);
  }
}
