import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/baseEntity/base.repository';
import {
  GetManyUsersArgsT,
  GetOneUserIdentifierT,
  UserRepositoryI,
} from './user.interface';
import { UserEntity } from './user.entity';
import { CreateUserInput, UpdateUserInput } from './dto';

@Injectable()
export class UserRepository
  extends BaseRepository<UserEntity, GetOneUserIdentifierT, GetManyUsersArgsT>
  implements UserRepositoryI
{
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async createOne(input: CreateUserInput): Promise<UserEntity> {
    const user = await this.create(input);
    const newUser = await this.save(user);
    return newUser;
  }

  async updateOne(
    user: UserEntity,
    input: UpdateUserInput,
  ): Promise<UserEntity> {
    const updatedUser = Object.assign(user, input);
    const savedUser = await this.save(updatedUser);
    return savedUser;
  }

  async removeOne(user: UserEntity): Promise<UserEntity> {
    const id = user.id;
    const deletedUser = await this.remove(user);
    deletedUser.id = id;
    return deletedUser;
  }
}
