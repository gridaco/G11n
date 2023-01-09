import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../.prisma/prisma.service";
import { TextSet, Prisma, Project } from "@prisma/client";
import { CreateTextSetDto, UpdateTextSetDto } from "./text.object";

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
  async textSetByKey(params: {
    projectId: string;
    key: string;
  }): Promise<TextSet | null> {
    const { projectId, key } = params;
    return await this.prisma.textSet.findFirst({
      where: { projectId, key },
    });
  }

  async textSets(params: {
    projectId: string;
    key?: string;
    locale?: string;
  }): Promise<TextSet[]> {
    const { projectId, locale, key } = params;

    let texts: TextSet[] = await this.prisma.textSet.findMany({
      where: { projectId, key },
    });

    // texts.forEach((text: TextSet) => {

    // })

    return texts;
  }

  async createTextSet(data: CreateTextSetDto): Promise<TextSet> {
    try {
      let value = JSON.stringify(data.value);
      delete data.value;
      return await this.prisma.textSet.create({
        data: {
          ...data,
          value,
        },
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

  throwConflictException(e: Error) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        throw new ConflictException("Existing key already");
      }
      if (e.code === "P2025") {
        throw new ConflictException("Record not found");
      } else {
        throw new ConflictException(e);
      }
    }
    throw e;
  }
}
