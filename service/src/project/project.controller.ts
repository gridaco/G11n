import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from "@nestjs/common";
import { TextSet, Prisma } from "@prisma/client";
import { ProjectService } from "./project.service";

@Controller("projects")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get("/:projectId")
  async getProject(@Param() params: { projectId: string }) {
    return await this.projectService.getProject(params);
  }

  @Get("/")
  async getProjects() {
    return await this.projectService.getProjects();
  }

  @Post("/")
  async createProject(@Body() project: Prisma.ProjectCreateInput) {
    return await this.projectService.createProject(project);
  }
}
