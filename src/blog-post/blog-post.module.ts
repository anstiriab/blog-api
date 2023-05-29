import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPostEntity } from './blog-post.entity';
import { BlogPostService } from './blog-post.service';
import { BlogPostResolver } from './blog-post.resolver';
import { BlogModule } from 'src/blog/blog.module';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPostEntity]), BlogModule],
  providers: [BlogPostResolver, BlogPostService],
})
export class BlogPostModule {}
