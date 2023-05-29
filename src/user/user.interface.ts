import { DefaultEntityI } from 'src/common/defaultEntity/default.interface';
import { BlogI } from 'src/blog/blog.interface';
import { BlogPostI } from 'src/blog-post/blog-post.interface';

export interface UserI extends DefaultEntityI {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRoleEnum;
  password: string;
  blogs: BlogI[];
  blogPosts: BlogPostI[];
}

export enum UserRoleEnum {
  writer = 'writer',
  moderator = 'moderator',
}

export const NAME_LENGTH = 30;
