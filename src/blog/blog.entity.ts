import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/baseEntity/base.entity';
import { UserEntity } from 'src/user/user.entity';
import { BlogI } from './blog.interface';
import { BlogPostEntity } from 'src/blog-post/blog-post.entity';
import { BLOG_TITLE_MAX_LENGTH } from './blog.constants';

@Entity('blog')
export class BlogEntity extends BaseEntity implements BlogI {
  @Column({ length: BLOG_TITLE_MAX_LENGTH })
  title: string;

  @Column('text')
  description?: string;

  @ManyToOne(() => UserEntity, (user) => user.blogs, { onDelete: 'CASCADE' })
  writer: UserEntity;

  @OneToMany(() => BlogPostEntity, (blogPost) => blogPost.blog)
  blogPosts: BlogPostEntity[];
}
