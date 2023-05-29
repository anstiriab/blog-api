import { Get, Controller } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root(): string {
    return 'Hi! This is Blog API that exposes endpoints to manage the blogs platform.';
  }
}
