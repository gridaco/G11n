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
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/")
  async getHello() {
    return "service is running";
  }
}
