import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './blog.entity';
import { BlogService } from './blog.service';
import { BlogResolver } from './blog.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity])],
  providers: [BlogResolver, BlogService],
  exports: [BlogService],
})
export class BlogModule {}
