import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from 'src/user/user.interface';

export const Roles = (...roles: UserRoleEnum[]) => SetMetadata('roles', roles);
