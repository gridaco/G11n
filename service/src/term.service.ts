import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Term, Prisma } from '@prisma/client';

@Injectable()
export class TermService {
  constructor(private prisma: PrismaService) {}

  async term(id: string): Promise<Term | null> {
    return this.prisma.term.findUnique({
      where: { id: id },
    });
  }

  async terms(params: {
    langType?: string;
    name?: string;
    value?: string;
  }): Promise<Term[]> {
    const { langType, name, value } = params;
    return this.prisma.term.findMany({
      where: {
        langType,
        name,
        value,
      },
    });
  }

  async createTerm(data: Prisma.TermCreateInput): Promise<Term> {
    return this.prisma.term.create({
      data,
    });
  }

  async updateTerm(params: {
    id: string;
    data: Prisma.TermUpdateInput;
  }): Promise<Term> {
    const { id, data } = params;
    return this.prisma.term.update({
      where: { id },
      data,
    });
  }

  async deleteTerm(id: string) {}
}
