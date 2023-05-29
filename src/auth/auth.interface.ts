import { Request } from 'express';
import { UserEntity } from '../user/user.entity';
import { UserRoleEnum } from 'src/user/user.interface';

export interface UserPayloadI {
  id: number;
  role: UserRoleEnum;
  firstName: string;
  lastName: string;
}

export interface RequestWithContext extends Request {
  user?: UserEntity;
}
