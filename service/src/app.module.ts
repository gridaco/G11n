import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './.prisma/prisma.service';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [PrismaService, AppService],
})
export class AppModule {}
