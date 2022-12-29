import { Injectable } from '@nestjs/common';
import { PrismaService } from './.prisma/prisma.service';
import { Translation, Prisma } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  // find translation by id
  async translation(id: string) {
    let translation = await this.prisma.translation.findUnique({
      where: { id: id },
    });

    let placeholder = {};
    if (translation.value) {
      placeholder = await this.getPlaceholder(translation.value);
    }

    return {
      translation,
      placeholder,
    };
  }

  async getPlaceholder(value) {
    return {}; // ex) { kr: { a: 'aa' } }
  }

  // find translationw by key
  async translationByKey(key: string): Promise<Translation | null> {
    return await this.prisma.translation.findFirst({
      where: { key },
    });
  }

  async translations(params): Promise<Translation[]> {
    const { key, value } = params;

    return await this.prisma.translation.findMany({
      where: { key, value },
    });
  }

  async createTranslation(
    data: Prisma.TranslationCreateInput
  ): Promise<Translation> {
    return await this.prisma.translation.create({
      data,
    });
  }

  async updateTranslation(params: {
    id: string;
    data: Prisma.TranslationUpdateInput;
  }): Promise<Translation> {
    const { id, data } = params;
    return await this.prisma.translation.update({
      where: { id },
      data,
    });
  }

  async deleteTranslation(id: string): Promise<Translation> {
    return await this.prisma.translation.delete({
      where: { id },
    });
  }
}
