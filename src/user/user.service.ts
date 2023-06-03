import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { AuthConfigI } from 'src/config';
import { PaginatedTypeI } from 'src/common/baseEntity/base.interface';
import { UserI, GetManyUsersArgsT, UserRepositoryI } from './user.interface';
import { CreateUserInput, UpdateUserInput } from './dto';
import { USER_REPOSITORY_TOKEN } from './user.constants';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private userRepository: UserRepositoryI,
    private configService: ConfigService,
  ) {}

  async getUser(id: number): Promise<UserI> {
    const user = await this.userRepository.getOne(
      { id },
      { isThrowException: true },
    );
    return user;
  }

  async getUserByEmail(email: string): Promise<UserI | null> {
    const user = await this.userRepository.getOne({ email });
    return user;
  }

  async getUsers(args: GetManyUsersArgsT): Promise<PaginatedTypeI<UserI>> {
    const result = await this.userRepository.getMany(args);
    return result;
  }

  async createUser(input: CreateUserInput): Promise<UserI> {
    const userWithSameEmail = await this.getUserByEmail(input.email);
    if (userWithSameEmail) {
      throw new ForbiddenException('User with this email already exists');
    }

    input.password = await this.hashPassword(input.password);

    const newUser = await this.userRepository.createOne(input);
    return newUser;
  }

  async updateUser(user: UserI, input: UpdateUserInput): Promise<UserI> {
    if (input.email) {
      const userWithSameEmail = await this.getUserByEmail(input.email);
      if (userWithSameEmail && userWithSameEmail.id !== user.id) {
        throw new ForbiddenException('The user with this email already exists');
      }
    }

    if (input.password) {
      input.password = await this.hashPassword(input.password);
    }

    const savedUser = await this.userRepository.updateOne(user, input);
    return savedUser;
  }

  async removeUser(user: UserI): Promise<UserI> {
    const deletedUser = await this.userRepository.removeOne(user);
    return deletedUser;
  }

  async hashPassword(password: string): Promise<string> {
    const authConfig = this.configService.getOrThrow<AuthConfigI>('auth');

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt + authConfig.password.salt);

    return hash;
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    const result = await bcrypt.compare(password, hash);
    return result;
  }
}
