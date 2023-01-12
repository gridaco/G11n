import { Injectable } from "@nestjs/common";
import { PrismaService } from "../.prisma/prisma.service";
import { TextSet, Prisma, Project } from "@prisma/client";

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

  async createProject(project: Prisma.ProjectCreateInput): Promise<Project> {
    return await this.prisma.project.create({
      data: project,
    });
  }
}
