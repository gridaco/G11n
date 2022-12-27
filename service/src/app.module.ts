import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './.prisma/prisma.service';
import { TermService } from './term.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [PrismaService, TermService],
})
export class AppModule {}
