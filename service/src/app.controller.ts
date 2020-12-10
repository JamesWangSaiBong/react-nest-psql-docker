import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('test')
  async createTest(@Body() data) {
    return this.appService.saveTest(data);
  }

  @Get('tests')
  async getTests(@Query('title') title) {
    return !!title
      ? this.appService.getTestsByTitle(title)
      : this.appService.getAllTests();
  }

  @Get('tests/:id')
  async getTestById(@Param('id') id: number) {
    return this.appService.getTestById(id);
  }
}
