import { Module } from '@nestjs/common';
import { TextSetController } from './text-set.controller';
import { PrismaService } from '../.prisma/prisma.service';
import { TextSetService } from './text-set.service';

@Module({
  imports: [],
  controllers: [TextSetController],
  providers: [PrismaService, TextSetService],
})
export class TextSetModule {}
