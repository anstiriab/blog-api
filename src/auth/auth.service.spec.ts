import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/user/user.entity';
import { customRepositoryMockFactory } from 'src/utils/testing';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { GqlExecutionContext } from '@nestjs/graphql';
import { USER_REPOSITORY_TOKEN } from 'src/user/user.constants';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        ConfigService,
        JwtService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useFactory: customRepositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should not authenticate non-existing user', async () => {
    jest
      .spyOn(userService, 'getUserByEmail')
      .mockImplementation(async () => null);

    try {
      await service.authenticate('test@gmail.com', 'secret');
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });

  it('should not authenticate user with an incorrect password', async () => {
    jest
      .spyOn(userService, 'verifyPassword')
      .mockImplementation(async () => false);

    try {
      await service.authenticate('test@gmail.com', 'secret');
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });

  it('should authenticate user', async () => {
    const existedUser = new UserEntity();
    existedUser.email = 'test@gmail.com';
    existedUser.password = 'secret';

    const token = 'token';
    jest.spyOn(jwtService, 'signAsync').mockImplementation(async () => token);
    jest
      .spyOn(userService, 'getUserByEmail')
      .mockImplementation(async () => existedUser);
    jest
      .spyOn(userService, 'verifyPassword')
      .mockImplementation(async () => true);

    const result = await service.authenticate(
      existedUser.email,
      existedUser.password,
    );
    expect(result).toHaveProperty('accessToken');
    expect(result.accessToken).toBe(token);
  });

  it('should return request with context (http)', () => {
    const user = { id: 1 };
    const context = new ExecutionContextHost([{ user }]);

    const result = AuthService.getRequestWithContext(context);
    expect(result.user).toBe(user);
  });

  it('should return request with context (graphql)', () => {
    const user = { id: 1 };
    const context = new ExecutionContextHost([{ user }]);
    const graphqlContext = GqlExecutionContext.create(context);

    jest.spyOn(graphqlContext, 'getType').mockImplementation(() => 'graphql');
    jest
      .spyOn(GqlExecutionContext, 'create')
      .mockImplementation(() => graphqlContext);
    jest.spyOn(graphqlContext, 'getContext').mockImplementation(() => ({
      req: { user },
    }));

    const result = AuthService.getRequestWithContext(graphqlContext);
    expect(result.user).toBe(user);
  });
});
