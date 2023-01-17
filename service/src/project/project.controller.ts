import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  Res,
  StreamableFile,
  Header,
} from "@nestjs/common";
import { ProjectService } from "./project.service";
import { CreateProjectDto } from "./project.object";
import { Response } from "express";

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

  @Header("Content-Type", "application/zip")
  @Header("Content-Disposition", "attachment; filename=translations.zip")
  @Get("/:projectId/export")
  async exportProject(
    @Param() params: { projectId: string },
    @Res() res: Response
  ): Promise<void> {
    await this.projectService.exportProject(params.projectId, res);
  }

  @Post("/")
  async createProject(@Body() project: CreateProjectDto) {
    return await this.projectService.createProject(project);
  }
}
