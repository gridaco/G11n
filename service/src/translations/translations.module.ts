import { Module } from "@nestjs/common";
import { AppController } from "./translations.controller";
import { PrismaService } from "./.prisma/prisma.service";
import { AppService } from "./translations.service";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [PrismaService, AppService],
})
export class AppModule {}
