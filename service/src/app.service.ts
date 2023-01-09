import { Injectable } from "@nestjs/common";
import { PrismaService } from "./.prisma/prisma.service";
import { TextSet, Prisma, Project } from "@prisma/client";

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
}
