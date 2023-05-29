import { PaginationArgsI } from 'src/common/pagination/pagination.args';
import { DefaultEntityI } from 'src/common/defaultEntity/default.interface';
import { BlogI } from 'src/blog/blog.interface';
import { UserI } from 'src/user/user.interface';

export const BLOG_POST_TITLE_LENGTH = 150;

export interface BlogPostI extends DefaultEntityI {
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
