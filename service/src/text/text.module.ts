import { Module } from "@nestjs/common";
import { TextSetController } from "./text.controller";
import { PrismaService } from "../.prisma/prisma.service";
import { TextSetService } from "./text.service";

@Module({
  imports: [],
  controllers: [TextSetController],
  providers: [PrismaService, TextSetService],
})
export class TextSetModule {}
