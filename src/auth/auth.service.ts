import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { RequestWithContext, UserPayloadI } from './auth.interface';
import { SignInOutput } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async authenticate(email: string, password: string): Promise<SignInOutput> {
    const user = await this.userService.findOneToSignIn(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordCorrect = await this.userService.verifyPassword(
      password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Password is incorrect');
    }

    const payload: UserPayloadI = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    const result = {
      accessToken: await this.jwtService.signAsync(payload),
    };

    return result;
  }

  static getRequestWithContext(context: ExecutionContext): RequestWithContext {
    let request: RequestWithContext;
    if (context.getType<GqlContextType>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      request = ctx.getContext().req;
    } else {
      request = context.switchToHttp().getRequest<RequestWithContext>();
    }

    return request;
  }
}
