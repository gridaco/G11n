import { Injectable, StreamableFile } from "@nestjs/common";
import { PrismaService } from "../.prisma/prisma.service";
import { Project } from "@prisma/client";
import { CreateProjectDto } from "./project.object";
import { createReadStream, createWriteStream, writeFileSync } from "fs";
import { join } from "path";
import * as archiver from "archiver";
import { Response } from "express";

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async getProject(params: { projectId: string }): Promise<Project | null> {
    return await this.prisma.project.findUnique({
      where: { id: params.projectId },
    });
  }

  async getProjects(): Promise<Project[]> {
    return await this.prisma.project.findMany();
  }

  async exportProject(projectId: string, res: Response): Promise<void> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    const textsByProject = await this.prisma.textSet.findMany({
      where: { projectId },
    });

    project.locales.forEach((locale) => {
      let values: any = {};
      textsByProject.forEach((text) => {
        let value: any = JSON.parse(text.value as string);
        if (value[locale]) {
          values[text.key] = value[locale];
        }
      });

      values = JSON.stringify(values);
      values = values.replaceAll(",", ",\n");
      values = values.replace("{", "{\n");
      values = values.replace("}", "\n}");
      writeFileSync(join(process.cwd(), `attachments/${locale}.json`), values);
      const file = createReadStream(
        join(process.cwd(), `attachments/${locale}.json`)
      );
    });

    const output = createWriteStream(
      join(process.cwd(), `attachments/attachments.zip`)
    );
    const archive = archiver("zip", {
      zlib: { level: 1 },
    });
    output.on("close", () => {
      console.log(archive.pointer() + " total bytes");
      console.log("archiver has been finalized");
    });
    archive.on("warning", (err) => {
      if (err.code === "ENOENT") {
        console.log("warning");
      } else {
        throw err;
      }
    });
    archive.on("error", (err) => {
      throw err;
    });
    archive.pipe(output);

    project.locales.forEach((locale) => {
      const file = join(process.cwd(), `attachments/${locale}.json`);
      archive.append(createReadStream(file), { name: `${locale}.json` });
    });

    archive.finalize();
    archive.pipe(res);
  }

  async createProject(project: CreateProjectDto): Promise<Project> {
    return await this.prisma.project.create({
      data: project,
    });
  }
}
