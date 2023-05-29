import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Repository } from 'typeorm';
import { MockType, repositoryMockFactory } from 'src/utils/testing';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { authConfig } from 'src/config';
import { UserRoleEnum } from './user.interface';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let repositoryMock: MockType<Repository<UserEntity>>;
  let user: UserEntity;
  let hashedPassword: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [authConfig] })],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repositoryMock = module.get(getRepositoryToken(UserEntity));
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
    repositoryMock.findOne.mockReturnValue(existedUser);

    user = await service.findOneToSignIn(email);

    expect(user).toEqual(existedUser);
    expect(user).toHaveProperty('password');
    expect(repositoryMock.findOne).toHaveBeenCalledWith({
      where: { email },
      select: ['password', 'id', 'firstName', 'lastName', 'role'],
    });
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
    repositoryMock.findOneBy.mockReturnValue(user);

    const result = await service.findOne(userId);

    expect(result).toEqual(user);
    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: userId });
  });

  it('should not find user', async () => {
    const userId = 1000;
    repositoryMock.findOneBy.mockReturnValue(undefined);

    let result;
    try {
      result = await service.findOne(userId);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }

    if (result) expect(true).toBe(false);
    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: userId });
  });

  it('should return list of users', async () => {
    const moderator = new UserEntity();
    const writer = new UserEntity();
    repositoryMock.find.mockReturnValue([moderator, writer]);

    const result = await service.findAll();

    expect(result).toContain(moderator);
    expect(result).toContain(writer);
    expect(repositoryMock.find).toHaveBeenCalledWith();
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

    repositoryMock.create.mockReturnValue(newUser);
    repositoryMock.findOneBy.mockReturnValue(undefined);

    user = await service.create(userData);

    expect(user).toBeInstanceOf(UserEntity);
    expect(user).not.toHaveProperty('password');
    expect(repositoryMock.create).toHaveBeenCalledWith(userData);
    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({
      email: userData.email,
    });
  });

  it('should not create user with same email', async () => {
    const existedUser = new UserEntity();
    existedUser.email = 'test@gmail.com';
    repositoryMock.findOneBy.mockReturnValue(existedUser);

    const userData = {
      email: existedUser.email,
      firstName: 'John',
      lastName: 'Doe',
      role: UserRoleEnum.writer,
      password: 'secret',
    };

    let result;
    try {
      result = await service.create(userData);
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenException);
    }

    if (result) expect(true).toBe(false);
    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({
      email: existedUser.email,
    });
  });

  it('should update user', async () => {
    const newUserData = {
      email: 'updated@gmail.com',
      lastName: 'Johnson',
      password: 'new',
    };

    Object.assign(user, newUserData);
    repositoryMock.save.mockReturnValue(user);
    repositoryMock.findOneBy.mockReturnValue(undefined);

    const result = await service.update(user, newUserData);

    expect(result).toBeInstanceOf(UserEntity);
    expect(result.email).toEqual(newUserData.email);
    expect(result.lastName).toEqual(newUserData.lastName);
    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({
      email: newUserData.email,
    });
  });

  it('should not update user with same email', async () => {
    const existedUser = new UserEntity();
    existedUser.id = 1;
    existedUser.email = 'new-test@gmail.com';
    repositoryMock.findOneBy.mockReturnValue(existedUser);

    const currentUser = new UserEntity();
    currentUser.id = 2;
    currentUser.email = 'test@gmail.com';

    let result;
    try {
      result = await service.update(currentUser, {
        email: existedUser.email,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenException);
    }

    if (result) expect(true).toBe(false);
    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({
      email: existedUser.email,
    });
  });

  it('should remove user', async () => {
    repositoryMock.remove.mockReturnValue(user);
    const result = await service.remove(user);

    expect(result.id).toEqual(user.id);
    expect(repositoryMock.remove).toHaveBeenCalledWith(user);
  });
});
