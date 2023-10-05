import { DiscardType } from '@prisma/client';
import { IsEnum, IsNumber } from 'class-validator';

export class CreateDiscardDto {
  @IsEnum(DiscardType)
  readonly type: DiscardType;
  @IsNumber()
  readonly points: number;
}
