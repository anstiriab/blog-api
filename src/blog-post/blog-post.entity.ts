import { Column, Entity, ManyToOne } from 'typeorm';
import { DefaultEntity } from 'src/common/defaultEntity/default.entity';
import { UserEntity } from 'src/user/user.entity';
import { BlogEntity } from 'src/blog/blog.entity';
import { BLOG_TITLE_MAX_LENGTH } from 'src/blog/blog.interface';
import { BlogPostI } from './blog-post.interface';

@Entity('blog_post')
export class BlogPostEntity extends DefaultEntity implements BlogPostI {
  @Column({ length: BLOG_TITLE_MAX_LENGTH })
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
