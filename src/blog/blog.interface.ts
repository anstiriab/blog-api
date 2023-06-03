import {
  BaseEntityI,
  BaseRepositoryI,
  PaginationI,
  SortingI,
  PaginatedTypeI,
} from 'src/common/baseEntity/base.interface';
import { BlogPostI } from 'src/blog-post/blog-post.interface';
import { UserI } from 'src/user/user.interface';

export interface BlogI extends BaseEntityI {
  title: string;
  description?: string;
  writer?: UserI;
  writerId: number;
  blogPosts?: BlogPostI[];
}

export type GetOneBlogIdentifierT = { id: number };

export enum BlogsSortingFieldsEnum {
  createdAt = 'createdAt',
}

export interface BlogsFilterI {
  writerId?: number;
}

export type GetManyBlogsArgsT = PaginationI &
  SortingI<keyof typeof BlogsSortingFieldsEnum> & {
    filter?: BlogsFilterI;
  };

export type CreateBlogT = {
  title: string;
  description?: string;
  writer: UserI;
};

export type UpdateBlogT = Partial<Omit<CreateBlogT, 'writer'>>;

export interface BlogRepositoryI
  extends BaseRepositoryI<BlogI, GetOneBlogIdentifierT, GetManyBlogsArgsT> {
  getMany: (args: GetManyBlogsArgsT) => Promise<PaginatedTypeI<BlogI>>;
  createOne: (input: CreateBlogT) => Promise<BlogI>;
  updateOne: (blog: BlogI, input: UpdateBlogT) => Promise<BlogI>;
  removeOne: (blog: BlogI) => Promise<BlogI>;
}
