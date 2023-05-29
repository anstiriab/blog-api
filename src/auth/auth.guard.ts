import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthConfigI } from 'src/config';
import { UserRoleEnum } from 'src/user/user.interface';
import { UserPayloadI } from './auth.interface';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<UserRoleEnum[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      return true;
    }

    const request = AuthService.getRequestWithContext(context);

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    let userPayload: UserPayloadI;
    const tokenConfig = this.configService.get<AuthConfigI>('auth').accessToken;
    try {
      userPayload = await this.jwtService.verifyAsync<UserPayloadI>(token, {
        secret: tokenConfig.salt,
      });
      const user = await this.userService.findOne(userPayload.id);
      request.user = user;
    } catch {
      throw new UnauthorizedException();
    }

    const isRoleMatched = this.matchRoles(roles, userPayload.role);
    if (!isRoleMatched) {
      throw new ForbiddenException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private matchRoles(roles: UserRoleEnum[], role: UserRoleEnum): boolean {
    const result = roles.includes(role);
    return result;
  }
}
