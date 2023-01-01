import { IsJSON, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Project } from '@prisma/client';

export class CreateTextSetDto {
  @IsNotEmpty()
  key: string;

  @IsOptional()
  @IsJSON()
  value?: any;
  projectId: string;
}

export class UpdateTextSetDto {
  @IsOptional()
  key?: string;

  @IsOptional()
  @IsJSON()
  value?: any;
}
