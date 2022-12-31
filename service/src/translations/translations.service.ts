import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "./.prisma/prisma.service";
import { TextSet, Prisma } from "@prisma/client";

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  // find translation by id
  async translation(id: string) {
    let translation = await this.prisma.textSet.findUnique({
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
  async translationByKey(key: string): Promise<TextSet | null> {
    return await this.prisma.textSet.findFirst({
      where: { key },
    });
  }

  async translations(params): Promise<TextSet[]> {
    const { key, value } = params;

    return await this.prisma.textSet.findMany({
      where: { key, value },
    });
  }

  async createTranslation(data: Prisma.TextSetCreateInput): Promise<TextSet> {
    try {
      return await this.prisma.textSet.create({
        data,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === "P2002") {
          throw new ConflictException("Key already exists");
          //
        }
      } else {
        //
      }
    }

    // {
    //   key: 'test',
    //   value: {
    //     kr: '한국어',
    //     en: 'English',
    //   },
    // }

    // {
    //   key: 'test',
    //   value: {
    //     kr: 'asdf',
    //     en: 'sjgj;oejojg',
    //   },
    // }
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
