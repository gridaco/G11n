import { Module } from "@nestjs/common";
import { ProjectController } from "./project.controller";
import { PrismaService } from "../.prisma/prisma.service";
import { ProjectService } from "./project.service";

@Module({
  imports: [],
  controllers: [ProjectController],
  providers: [PrismaService, ProjectService],
})
export class ProjectModule {}
