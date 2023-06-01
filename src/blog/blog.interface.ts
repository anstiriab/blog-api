import {
  BaseEntityI,
  PaginationArgsI,
} from 'src/common/baseEntity/base.interface';
import { BlogPostI } from 'src/blog-post/blog-post.interface';
import { UserI } from 'src/user/user.interface';

export interface BlogI extends BaseEntityI {
  title: string;
  description?: string;
  writer: UserI;
  blogPosts: BlogPostI[];
}

export interface BlogsFilterI {
  writerId?: number;
}

export enum BlogsOrderByEnum {
  createdAtAsc = 'createdAtAsc',
  createdAtDesc = 'createdAtDesc',
}

export interface GetBlogsArgsI extends PaginationArgsI {
  filter?: BlogsFilterI;
  orderBy?: BlogsOrderByEnum;
}
