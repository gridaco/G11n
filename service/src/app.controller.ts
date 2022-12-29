import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { Translation, Prisma } from '@prisma/client';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  async getHello() {
    return 'service is running';
  }

  @Get('/all')
  async translations() {
    const params = {};
    return await this.appService.translations(params);
  }

  @Post('/create-translation')
  async createTranslation(@Body() translation: Translation) {
    return await this.appService.createTranslation(translation);
  }

  @Patch('/update-translation:id')
  async updateTranslation(@Param() id: string, @Body() data: Translation) {
    const params = { id, data };
    return await this.appService.updateTranslation(params);
  }

  @Delete('/delete-translation:id')
  async deleteTranslation(@Param() id: string) {
    return await this.appService.deleteTranslation(id);
  }

  @Get('/get-translation:name')
  async translationByKey(@Param() params) {
    console.log(params.name);
    return await this.appService.translationByKey(params.name);
  }
}
