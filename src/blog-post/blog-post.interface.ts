import {
  BaseEntityI,
  PaginationArgsI,
} from 'src/common/baseEntity/base.interface';
import { BlogI } from 'src/blog/blog.interface';
import { UserI } from 'src/user/user.interface';

export interface BlogPostI extends BaseEntityI {
  title: string;
  content: string;
  blog: BlogI;
  writer: UserI;
}

export interface BlogPostsFilterI {
  blogId?: number;
  writerId?: number;
}

export enum BlogPostsOrderByEnum {
  titleAsc = 'titleAsc',
  titleDesc = 'titleDesc',
  createdAtAsc = 'createdAtAsc',
  createdAtDesc = 'createdAtDesc',
}

export interface GetBlogPostsArgsI extends PaginationArgsI {
  filter?: BlogPostsFilterI;
  orderBy?: BlogPostsOrderByEnum;
}
