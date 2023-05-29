import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AuthConfigI } from 'src/config';
import { UserEntity } from './user.entity';
import { CreateUserInput, UpdateUserInput } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private configService: ConfigService,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  async findOneToSignIn(email: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['password', 'id', 'firstName', 'lastName', 'role'],
    });
    return user;
  }

  async create(input: CreateUserInput): Promise<UserEntity> {
    const userWithSameEmail = await this.findByEmail(input.email);
    if (userWithSameEmail) {
      throw new ForbiddenException('User with this email already exists');
    }

    input.password = await this.hashPassword(input.password);

    const user = await this.userRepository.create(input);
    const newUser = await this.userRepository.save(user);
    delete newUser.password;

    return newUser;
  }

  async update(user: UserEntity, input: UpdateUserInput): Promise<UserEntity> {
    if (input.email) {
      const userWithSameEmail = await this.findByEmail(input.email);
      if (userWithSameEmail && userWithSameEmail.id !== user.id) {
        throw new ForbiddenException('The user with this email already exists');
      }
    }

    if (input.password) {
      input.password = await this.hashPassword(input.password);
    }

    const updatedUser = Object.assign(user, input);
    const savedUser = await this.userRepository.save(updatedUser);
    delete savedUser.password;

    return savedUser;
  }

  async remove(user: UserEntity): Promise<UserEntity> {
    const userId = user.id;
    const deletedUser = await this.userRepository.remove(user);
    deletedUser.id = userId;

    return deletedUser;
  }

  async hashPassword(password: string): Promise<string> {
    const authConfig = this.configService.get<AuthConfigI>('auth');

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt + authConfig.password.salt);

    return hash;
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    const result = await bcrypt.compare(password, hash);
    return result;
  }
}
