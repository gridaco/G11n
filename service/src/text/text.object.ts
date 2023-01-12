import { IsJSON, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Project, TextSet } from "@prisma/client";

export class CreateTextSetDto {
  id?: string;
  @ApiProperty({
    description: "the keycode of translation",
    required: true,
  })
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    description: "the values by locales",
    required: false,
  })
  @IsOptional()
  value?: { [locale: string]: string };

  @ApiProperty({
    description: "the project id",
    required: true,
  })
  projectId: string;
}

export class UpdateTextSetDto {
  @ApiProperty({
    description: "the keycode of translation",
    required: false,
  })
  @IsOptional()
  key?: string;

  @ApiProperty({
    description: "the values by locales",
    required: false,
  })
  @IsOptional()
  value?: { [locale: string]: string };
}
