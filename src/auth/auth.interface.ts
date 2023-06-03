import { Request } from 'express';
import { UserI, UserRoleEnum } from 'src/user/user.interface';

export interface UserPayloadI {
  id: number;
  role: UserRoleEnum;
  firstName: string;
  lastName: string;
}

export interface RequestWithContext extends Request {
  user?: UserI;
}
