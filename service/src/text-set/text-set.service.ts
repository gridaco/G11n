import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../.prisma/prisma.service';
import { TextSet, Prisma, Project } from '@prisma/client';
import { CreateTextSetDto, UpdateTextSetDto } from './text-set.object';

@Injectable()
export class TextSetService {
  constructor(private prisma: PrismaService) {}

  // find textSet by id
  async textSet(id: string) {
    return await this.prisma.textSet.findUnique({
      where: { id: id },
    });
  }

  // find textSetw by key
  async textSetByKey(key: string): Promise<TextSet | null> {
    return await this.prisma.textSet.findFirst({
      where: { key },
    });
  }

  async textSets(params): Promise<TextSet[]> {
    const { key, value } = params;

    return await this.prisma.textSet.findMany({
      where: { key, value },
    });
  }

  async createTextSet(data: CreateTextSetDto): Promise<TextSet> {
    try {
      //sample project
      const project = await this.prisma.project.findFirst({
        where: { name: 'test3' },
      });
      data.projectId = project.id;
      return await this.prisma.textSet.create({
        data,
      });
    } catch (e) {
      this.throwConflictException(e);
    }
  }

  async updateTextSet(params: {
    id: string;
    data: UpdateTextSetDto;
  }): Promise<TextSet> {
    try {
      const { id, data } = params;
      return await this.prisma.textSet.update({
        where: { id },
        data,
      });
    } catch (e) {
      this.throwConflictException(e);
    }
  }

  async deleteTextSet(id: string): Promise<TextSet> {
    try {
      return await this.prisma.textSet.delete({
        where: { id },
      });
    } catch (e) {
      this.throwConflictException(e);
    }
  }

  throwConflictException(e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        throw new ConflictException('Existing key already');
      }
      if (e.code === 'P2025') {
        throw new ConflictException('Record not found');
      } else {
        throw new ConflictException(e);
      }
    }
    throw e;
  }
}
