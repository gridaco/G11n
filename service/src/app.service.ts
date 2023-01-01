import { Injectable } from '@nestjs/common';
import { PrismaService } from './.prisma/prisma.service';
import { TextSet, Prisma, Project } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async createProjectSample(name: string): Promise<Project> {
    return await this.prisma.project.create({
      data: {
        name,
      },
    });
  }
}
