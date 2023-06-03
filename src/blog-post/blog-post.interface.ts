import {
  BaseEntityI,
  BaseRepositoryI,
  SortingI,
  PaginatedTypeI,
  PaginationI,
} from 'src/common/baseEntity/base.interface';
import { BlogI } from 'src/blog/blog.interface';
import { UserI } from 'src/user/user.interface';

export interface BlogPostI extends BaseEntityI {
  title: string;
  content: string;
  blog?: BlogI;
  blogId: number;
  writer?: UserI;
  writerId: number;
}

export type GetOneBlogPostIdentifierT = { id: number };

export enum BlogPostsSortingFieldsEnum {
  title = 'title',
  createdAt = 'createdAt',
}
export interface BlogPostsFilterI {
  blogId?: number;
  writerId?: number;
}

export type GetManyBlogPostsArgsT = PaginationI &
  SortingI<keyof typeof BlogPostsSortingFieldsEnum> & {
    filter?: BlogPostsFilterI;
  };

export type CreateBlogPostT = {
  title: string;
  content: string;
  blog: BlogI;
  writer: UserI;
};

export type UpdateBlogPostT = Partial<Omit<CreateBlogPostT, 'writer'>>;

export interface BlogPostRepositoryI
  extends BaseRepositoryI<
    BlogPostI,
    GetOneBlogPostIdentifierT,
    GetManyBlogPostsArgsT
  > {
  getMany: (args: GetManyBlogPostsArgsT) => Promise<PaginatedTypeI<BlogPostI>>;
  createOne: (input: CreateBlogPostT) => Promise<BlogPostI>;
  updateOne: (blog: BlogPostI, input: UpdateBlogPostT) => Promise<BlogPostI>;
  removeOne: (blog: BlogPostI) => Promise<BlogPostI>;
}
