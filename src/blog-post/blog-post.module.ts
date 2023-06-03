import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPostEntity } from './blog-post.entity';
import { BlogPostService } from './blog-post.service';
import { BlogPostResolver } from './blog-post.resolver';
import { BlogModule } from 'src/blog/blog.module';
import { BlogPostRepository } from './blog-post.repository';
import { BLOG_POST_REPOSITORY_TOKEN } from './blog-post.constants';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPostEntity]), BlogModule, UserModule],
  providers: [
    BlogPostResolver,
    BlogPostService,
    {
      provide: BLOG_POST_REPOSITORY_TOKEN,
      useClass: BlogPostRepository,
    },
  ],
})
export class BlogPostModule {}
