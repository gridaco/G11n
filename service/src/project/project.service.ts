import { Injectable, StreamableFile } from "@nestjs/common";
import { PrismaService } from "../.prisma/prisma.service";
import { Project } from "@prisma/client";
import { CreateProjectDto } from "./project.object";
import { createReadStream } from "fs";
import { join } from "path";

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async getProject(params: { projectId: string }): Promise<Project | null> {
    return await this.prisma.project.findUnique({
      where: { id: params.projectId },
    });
  }

  async getProjects(): Promise<Project[]> {
    return await this.prisma.project.findMany();
  }

  async exportProject(projectId: string): Promise<StreamableFile> {
    const file = createReadStream(join(process.cwd(), "package.json"));

    return new StreamableFile(file);
  }

  async createProject(project: CreateProjectDto): Promise<Project> {
    return await this.prisma.project.create({
      data: project,
    });
  }
}
