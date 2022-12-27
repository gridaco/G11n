import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { TermService } from './term.service';
import { Term, Prisma } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: TermService) {}

  @Get('/')
  async getHello() {
    return 'service is running';
  }

  @Get(':name')
  async termByName(@Param() params): Promise<Term[]> {
    console.log(params.name);
    return await this.appService.termByName(params.name);
  }

  @Post()
  async createTerm(@Body() term: Term): Promise<Term> {
    console.log(term);
    return await this.appService.createTerm(term);
  }

  @Get('/create-sample')
  async createSample(): Promise<Term> {
    const term = {
      name: 'test',
      langType: 'ko',
      value: '테스트',
    };
    console.log(term);
    return await this.appService.createTerm(term);
  }
}
