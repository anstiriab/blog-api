import { PaginationArgsI } from 'src/common/pagination/pagination.args';
import { DefaultEntityI } from 'src/common/defaultEntity/default.interface';
import { BlogPostI } from 'src/blog-post/blog-post.interface';
import { UserI } from 'src/user/user.interface';

export const BLOG_TITLE_MAX_LENGTH = 150;
export const BLOG_DESCRIPTION_MAX_LENGTH = 1000;

export interface BlogI extends DefaultEntityI {
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
