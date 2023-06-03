import {
  PaginationI,
  BaseRepositoryI,
  SortingI,
} from 'src/common/baseEntity/base.interface';
import { BaseEntityI } from 'src/common/baseEntity/base.interface';
import { BlogI } from 'src/blog/blog.interface';
import { BlogPostI } from 'src/blog-post/blog-post.interface';

export interface UserI extends BaseEntityI {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: UserRoleEnum;
  password: string;
  blogs?: BlogI[];
  blogPosts?: BlogPostI[];
}

export enum UserRoleEnum {
  writer = 'writer',
  moderator = 'moderator',
}

export type GetOneUserIdentifierT = { id: number } | { email: string };

export enum UsersSortingFieldsEnum {
  email = 'email',
  createdAt = 'createdAt',
}

export type GetManyUsersArgsT = PaginationI &
  SortingI<keyof typeof UsersSortingFieldsEnum>;

export type CreateUserT = {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRoleEnum;
  password: string;
};

export type UpdateBlogT = Partial<Omit<CreateUserT, ' v'>>;

export interface UserRepositoryI
  extends BaseRepositoryI<UserI, GetOneUserIdentifierT, GetManyUsersArgsT> {
  createOne: (input: CreateUserT) => Promise<UserI>;
  updateOne: (user: UserI, input: UpdateBlogT) => Promise<UserI>;
  removeOne: (user: UserI) => Promise<UserI>;
}
