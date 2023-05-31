import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ParseIntPipe } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { User } from 'src/auth/user.decorator';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { CreateUserInput, UpdateUserInput, UserOutput } from './dto';
import { UserRoleEnum } from './user.interface';

@Resolver(() => UserOutput)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserOutput], { name: 'users' })
  @Roles(UserRoleEnum.moderator)
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => UserOutput, { name: 'user' })
  @Roles(UserRoleEnum.moderator)
  findOne(@Args('id', { type: () => Int }, ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Mutation(() => UserOutput)
  createUser(@Args('input') input: CreateUserInput) {
    return this.userService.create(input);
  }

  @Mutation(() => UserOutput)
  @Roles(UserRoleEnum.writer)
  updateUser(@User() user: UserEntity, @Args('input') input: UpdateUserInput) {
    return this.userService.update(user, input);
  }

  @Mutation(() => UserOutput)
  @Roles(UserRoleEnum.writer)
  removeUser(@User() user: UserEntity) {
    return this.userService.remove(user);
  }
}
