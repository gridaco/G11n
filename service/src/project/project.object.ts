import { IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProjectDto {
  id?: string;
  @ApiProperty({
    description: "the project name",
    required: true,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "the project locales",
    required: false,
  })
  @IsOptional()
  locales?: string[];
}

export class UpdateProjectDto {
  @ApiProperty({
    description: "the project name",
    required: false,
  })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: "the project locales",
    required: false,
  })
  @IsOptional()
  locales?: string[];
}
