import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ForbiddenException } from '@nestjs/common';
import authConfig from 'src/config/auth.config';
import { MockType, customRepositoryMockFactory } from 'src/utils/testing';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UserI, UserRoleEnum } from './user.interface';
import { UserRepository } from './user.repository';
import { USER_REPOSITORY_TOKEN } from './user.constants';

describe('UserService', () => {
  let service: UserService;
  let customRepositoryMock: MockType<UserRepository>;
  let user: UserI;
  let hashedPassword: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [authConfig] })],
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useFactory: customRepositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    customRepositoryMock = module.get(USER_REPOSITORY_TOKEN);
  });

  it('should hash password', async () => {
    const password = 'password';
    hashedPassword = await service.hashPassword(password);

    expect(hashedPassword).toBeTruthy();
  });

  it('should find user to sign in', async () => {
    const email = 'test@gmail.com';

    const existedUser = new UserEntity();
    existedUser.id = 1;
    existedUser.email = email;
    existedUser.firstName = 'John';
    existedUser.lastName = 'Doe';
    existedUser.role = UserRoleEnum.writer;
    existedUser.password = hashedPassword;
    customRepositoryMock.getOne.mockReturnValue(existedUser);

    const result = await service.getUserByEmail(email);
    if (result) user = result;

    expect(user).toEqual(existedUser);
    expect(user).toHaveProperty('password');
    expect(customRepositoryMock.getOne).toHaveBeenCalledWith({ email });
  });

  it('should verify the password', async () => {
    const password = 'password';
    const result = await service.verifyPassword(password, user.password);

    expect(result).toBeTruthy();
  });

  it('should find user', async () => {
    const userId = 1000;
    const user = new UserEntity();
    user.id = userId;
    customRepositoryMock.getOne.mockReturnValue(user);

    const result = await service.getUser(userId);

    expect(result).toEqual(user);
    expect(customRepositoryMock.getOne).toHaveBeenCalledWith(
      { id: userId },
      { isThrowException: true },
    );
  });

  it('should return list of users', async () => {
    const moderator = new UserEntity();
    const writer = new UserEntity();
    customRepositoryMock.getMany.mockReturnValue({
      count: 2,
      edges: [moderator, writer],
    });

    const pagination = { limit: 2, skip: 0 };
    const result = await service.getUsers({ pagination });

    expect(result.count).toBe(2);
    expect(result.edges).toContain(moderator);
    expect(result.edges).toContain(writer);
    expect(customRepositoryMock.getMany).toHaveBeenCalledWith({ pagination });
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

    customRepositoryMock.createOne.mockReturnValue(newUser);
    jest.spyOn(service, 'getUserByEmail').mockImplementation(async () => null);

    user = await service.createUser(userData);

    expect(user).toBeInstanceOf(UserEntity);
    expect(customRepositoryMock.createOne).toHaveBeenCalledWith(userData);
    expect(service.getUserByEmail).toHaveBeenCalledWith(userData.email);
  });

  it('should not create user with same email', async () => {
    const existedUser = new UserEntity();
    existedUser.email = 'test@gmail.com';
    jest
      .spyOn(service, 'getUserByEmail')
      .mockImplementation(async () => existedUser);

    const userData = {
      email: existedUser.email,
      firstName: 'John',
      lastName: 'Doe',
      role: UserRoleEnum.writer,
      password: 'secret',
    };

    let result;
    try {
      result = await service.createUser(userData);
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenException);
    }

    if (result) expect(true).toBe(false);
    expect(service.getUserByEmail).toHaveBeenCalledWith(userData.email);
  });

  it('should update user', async () => {
    const newUserData = {
      email: 'updated@gmail.com',
      lastName: 'Johnson',
      password: 'new',
    };

    Object.assign(user, newUserData);
    customRepositoryMock.updateOne.mockReturnValue(user);
    customRepositoryMock.getOne.mockReturnValue(undefined);

    const result = await service.updateUser(user, newUserData);

    expect(result).toBeInstanceOf(UserEntity);
    expect(result.email).toEqual(newUserData.email);
    expect(result.lastName).toEqual(newUserData.lastName);
    expect(customRepositoryMock.getOne).toHaveBeenCalledWith({
      email: newUserData.email,
    });
  });

  it('should not update user with same email', async () => {
    const existedUser = new UserEntity();
    existedUser.id = 1;
    existedUser.email = 'new-test@gmail.com';
    customRepositoryMock.getOne.mockReturnValue(existedUser);

    const currentUser = new UserEntity();
    currentUser.id = 2;
    currentUser.email = 'test@gmail.com';

    let result;
    try {
      result = await service.updateUser(currentUser, {
        email: existedUser.email,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenException);
    }

    if (result) expect(true).toBe(false);
    expect(customRepositoryMock.getOne).toHaveBeenCalledWith({
      email: existedUser.email,
    });
  });

  it('should remove user', async () => {
    customRepositoryMock.removeOne.mockReturnValue(user);
    const result = await service.removeUser(user);

    expect(result.id).toEqual(user.id);
    expect(customRepositoryMock.removeOne).toHaveBeenCalledWith(user);
  });
});
