import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './.prisma/prisma.service';
import { AppService } from './app.service';
import { TextSetModule } from './text-set/text-set.module';

@Module({
  imports: [TextSetModule],
  controllers: [AppController],
  providers: [PrismaService, AppService],
})
export class AppModule {}
