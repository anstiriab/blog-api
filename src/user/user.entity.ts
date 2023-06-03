import { Column, Entity, OneToMany } from 'typeorm';
import { Expose } from 'class-transformer';
import { BaseEntity } from 'src/common/baseEntity/base.entity';
import { BlogPostEntity } from 'src/blog-post/blog-post.entity';
import { BlogEntity } from 'src/blog/blog.entity';
import { UserI, UserRoleEnum } from './user.interface';
import { NAME_LENGTH } from './user.constants';

@Entity('user')
export class UserEntity extends BaseEntity implements UserI {
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

  @Column()
  password: string;

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @OneToMany(() => BlogEntity, (blog) => blog.writer)
  blogs?: BlogEntity[];

  @OneToMany(() => BlogPostEntity, (blogPost) => blogPost.writer)
  blogPosts?: BlogPostEntity[];
}
