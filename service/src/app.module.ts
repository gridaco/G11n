import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { PrismaService } from "./.prisma/prisma.service";
import { AppService } from "./app.service";
import { TextSetModule } from "./text/text.module";
import { ProjectModule } from "./project/project.module";

@Module({
  imports: [TextSetModule, ProjectModule],
  controllers: [AppController],
  providers: [PrismaService, AppService],
})
export class AppModule {}
