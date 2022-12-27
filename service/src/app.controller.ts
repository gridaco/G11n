import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { Term, Prisma } from '@prisma/client';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  async getHello() {
    return 'service is running';
  }

  @Get('/all')
  async terms() {
    const params = {
      name: 'test',
    };
    return await this.appService.terms(params);
  }

  @Post('/')
  async createTerm(@Body() term: Term) {
    console.log(term);
    return await this.appService.createTerm(term);
  }

  @Get('/create-sample')
  async createSample() {
    const term = {
      name: 'test',
      langType: 'ko',
      value: '테스트',
    };
    console.log(term);
    return await this.appService.createTerm(term);
  }

  @Get(':name')
  async termByName(@Param() params) {
    console.log(params.name);
    return await this.appService.termByName(params.name);
  }
}
