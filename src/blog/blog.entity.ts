import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { DefaultEntity } from 'src/common/defaultEntity/default.entity';
import { UserEntity } from 'src/user/user.entity';
import { BLOG_TITLE_MAX_LENGTH, BlogI } from './blog.interface';
import { BlogPostEntity } from 'src/blog-post/blog-post.entity';

@Entity('blog')
export class BlogEntity extends DefaultEntity implements BlogI {
  @Column({ length: BLOG_TITLE_MAX_LENGTH })
  title: string;

  @Column('text')
  description?: string;

  @ManyToOne(() => UserEntity, (user) => user.blogs, { onDelete: 'CASCADE' })
  writer: UserEntity;

  @OneToMany(() => BlogPostEntity, (blogPost) => blogPost.blog)
  blogPosts: BlogPostEntity[];
}
