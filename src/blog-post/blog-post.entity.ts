import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/baseEntity/base.entity';
import { UserEntity } from 'src/user/user.entity';
import { BlogEntity } from 'src/blog/blog.entity';
import { BLOG_POST_TITLE_MAX_LENGTH } from './blog-post.constants';
import { BlogPostI } from './blog-post.interface';

@Entity('blog_post')
export class BlogPostEntity extends BaseEntity implements BlogPostI {
  @Column({ length: BLOG_POST_TITLE_MAX_LENGTH })
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(() => BlogEntity, (blog) => blog.blogPosts, {
    onDelete: 'CASCADE',
  })
  blog: BlogEntity;

  @ManyToOne(() => UserEntity, (user) => user.blogPosts, {
    onDelete: 'CASCADE',
  })
  writer: UserEntity;
}
