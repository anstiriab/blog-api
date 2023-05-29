import { Column, Entity, OneToMany } from 'typeorm';
import { DefaultEntity } from 'src/common/defaultEntity/default.entity';
import { BlogEntity } from 'src/blog/blog.entity';
import { NAME_LENGTH, UserI, UserRoleEnum } from './user.interface';
import { BlogPostEntity } from 'src/blog-post/blog-post.entity';

@Entity('user')
export class UserEntity extends DefaultEntity implements UserI {
  @Column({ length: NAME_LENGTH })
  firstName: string;

  @Column({ length: NAME_LENGTH })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.writer,
  })
  role: UserRoleEnum;

  @Column({ select: false })
  password: string;

  @OneToMany(() => BlogEntity, (blog) => blog.writer)
  blogs: BlogEntity[];

  @OneToMany(() => BlogPostEntity, (blogPost) => blogPost.writer)
  blogPosts: BlogPostEntity[];
}
