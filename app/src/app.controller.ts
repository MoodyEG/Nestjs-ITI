import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiHeader } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('custom-header')
  @ApiHeader({
    name: 'custom-header',
    description: 'custom-header',
    schema: {
      default: 'custom-header',
    },
  })
  postHello(): string {
    return this.appService.getHello();
  }
}
