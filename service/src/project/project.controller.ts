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
import { createReadStream } from "fs";
import { join } from "path";

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

  @Header("Content-Disposition", "attachment; filename=project.json")
  @Get("/:projectId/export")
  async exportProject(
    @Param() params: { projectId: string }
  ): Promise<StreamableFile> {
    const file = createReadStream(join(process.cwd(), "package.json"));

    return await this.projectService.exportProject(params.projectId);
  }

  @Post("/")
  async createProject(@Body() project: CreateProjectDto) {
    return await this.projectService.createProject(project);
  }
}
