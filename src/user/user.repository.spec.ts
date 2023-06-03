import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { getDataSourceToken } from '@nestjs/typeorm';
import authConfig from 'src/config/auth.config';
import { dataSourceMockFactory } from 'src/utils/testing';
import { UserEntity } from './user.entity';
import { UserRoleEnum } from './user.interface';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  let repository: UserRepository;
  let user: UserEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [authConfig] })],
      providers: [
        UserRepository,
        {
          provide: getDataSourceToken(),
          useFactory: dataSourceMockFactory,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
  });

  it('should create user', async () => {
    const userData = {
      email: 'test@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRoleEnum.writer,
      password: 'secret',
    };
    const newUser = new UserEntity();
    Object.assign(newUser, userData);

    jest.spyOn(repository, 'create').mockImplementation(() => newUser);
    jest.spyOn(repository, 'save').mockImplementation(async () => newUser);

    user = await repository.createOne(userData);

    expect(user).toBeInstanceOf(UserEntity);
    expect(repository.create).toHaveBeenCalledWith(userData);
  });

  it('should update user', async () => {
    const newUserData = {
      email: 'updated@gmail.com',
      lastName: 'Johnson',
      password: 'new',
    };

    Object.assign(user, newUserData);
    jest.spyOn(repository, 'save').mockImplementation(async () => user);

    const result = await repository.updateOne(user, newUserData);

    expect(result).toBeInstanceOf(UserEntity);
    expect(result.email).toEqual(newUserData.email);
    expect(result.lastName).toEqual(newUserData.lastName);
  });

  it('should remove user', async () => {
    jest.spyOn(repository, 'remove').mockImplementation(async () => user);

    const result = await repository.removeOne(user);

    expect(result.id).toEqual(user.id);
    expect(repository.remove).toHaveBeenCalledWith(user);
  });
});
