import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from "@nestjs/common";
import { TextSet, Prisma } from "@prisma/client";
import { AppService } from "./translations.service";

@Controller("/translations")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/")
  async translations() {
    const params = {};
    return await this.appService.translations(params);
  }

  @Post("/")
  async createTranslation(@Body() translation: CreateNewTextSetRequestDTO) {
    return await this.appService.createTranslation(translation);
  }

  @Patch("/:id")
  async updateTranslation(@Param() id: string, @Body() data: Translation) {
    const params = { id, data };
    return await this.appService.updateTranslation(params);
  }

  @Delete("//:id")
  async deleteTranslation(@Param() id: string) {
    return await this.appService.deleteTranslation(id);
  }

  @Get("//:name")
  async translationByKey(@Param() params) {
    console.log(params.name);
    return await this.appService.translationByKey(params.name);
  }
}

class CreateNewTextSetRequestDTO {
  @IsNotEmpty()
  key: string;
}
