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
import { TextSetService } from "./text.service";
import { CreateTextSetDto, UpdateTextSetDto } from "./text.object";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("textset")
@Controller("texts")
export class TextSetController {
  constructor(private readonly textSetService: TextSetService) {}

  @Get("/:projectId/locales/:locale")
  async textSets(
    @Param() params: { projectId: string; locale?: string; key?: string }
  ) {
    return await this.textSetService.textSets(params);
  }

  @Get("/:projectId/keys/:key")
  async textSetByKey(@Param() params: { projectId: string; key: string }) {
    return await this.textSetService.textSetByKey(params);
  }

  @Post("/")
  async createTextSet(@Body() textSet: CreateTextSetDto) {
    return await this.textSetService.createTextSet(textSet);
  }

  @Patch("/:id")
  async updateTextSet(
    @Param() params: { id: string },
    @Body() data: UpdateTextSetDto
  ) {
    const patch = { id: params.id, data };
    return await this.textSetService.updateTextSet(patch);
  }

  @Delete("/:id")
  async deleteTextSet(@Param() params: { id: string }) {
    return await this.textSetService.deleteTextSet(params.id);
  }
}
