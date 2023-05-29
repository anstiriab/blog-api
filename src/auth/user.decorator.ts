import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthService } from './auth.service';

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = AuthService.getRequestWithContext(context);
    return request.user;
  },
);
