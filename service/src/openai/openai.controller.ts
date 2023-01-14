import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from "@nestjs/common";
import { OpenAIService } from "./openai.service";

@Controller("openai")
export class OpenAIController {
  constructor(private readonly service: OpenAIService) {}

  @Get("/")
  async test() {
    // return await this.service.();
    return "service is running";
  }
}
