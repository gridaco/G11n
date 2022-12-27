import { Injectable } from '@nestjs/common';
import { PrismaService } from './.prisma/prisma.service';
import { Term, Prisma } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  // find term by id
  async term(id: string): Promise<Term | null> {
    return await this.prisma.term.findUnique({
      where: { id: id },
    });
  }

  // find term by key
  async termByName(name: string): Promise<Term[] | null> {
    return await this.prisma.term.findMany({
      where: { name },
    });
  }

  async terms(params: {
    langType?: string;
    name?: string;
    value?: string;
  }): Promise<Term[]> {
    const { langType, name, value } = params;
    return await this.prisma.term.findMany({
      where: {
        langType,
        name,
        value,
      },
    });
  }

  async createTerm(data: Prisma.TermCreateInput): Promise<Term> {
    console.log(data);
    return await this.prisma.term.create({
      data,
    });
  }

  async updateTerm(params: {
    id: string;
    data: Prisma.TermUpdateInput;
  }): Promise<Term> {
    const { id, data } = params;
    return await this.prisma.term.update({
      where: { id },
      data,
    });
  }

  async deleteTerm(id: string): Promise<Term> {
    return await this.prisma.term.delete({
      where: { id },
    });
  }
}
