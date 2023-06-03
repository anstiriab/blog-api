import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './blog.entity';
import { BlogService } from './blog.service';
import { BlogResolver } from './blog.resolver';
import { BlogRepository } from './blog.repository';
import { BLOG_REPOSITORY_TOKEN } from './blog.constants';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity])],
  providers: [
    BlogResolver,
    BlogService,
    {
      provide: BLOG_REPOSITORY_TOKEN,
      useClass: BlogRepository,
    },
  ],
  exports: [BlogService],
})
export class BlogModule {}
