import { IsJSON, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTextSetDto {
  @ApiProperty({
    description: 'the keycode of translation',
    required: true,
  })
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    description: 'the values by locales',
    required: false,
  })
  @IsOptional()
  @IsJSON()
  value?: any;

  @ApiProperty({
    description: 'the project id',
    required: true,
  })
  projectId: string;
}

export class UpdateTextSetDto {
  @ApiProperty({
    description: 'the keycode of translation',
    required: false,
  })
  @IsOptional()
  key?: string;

  @ApiProperty({
    description: 'the values by locales',
    required: false,
  })
  @IsOptional()
  @IsJSON()
  value?: any;
}
