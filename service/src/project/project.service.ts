import { Injectable } from "@nestjs/common";
import { PrismaService } from "../.prisma/prisma.service";
import { TextSet, Project } from "@prisma/client";
import { CreateProjectDto } from "./project.object";

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

  async createProject(project: CreateProjectDto): Promise<Project> {
    return await this.prisma.project.create({
      data: project,
    });
  }
}
