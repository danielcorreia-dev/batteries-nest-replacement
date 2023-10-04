import { DiscardType } from '@prisma/client';

export class CreateDiscardDto {
  readonly type: DiscardType;
  readonly points: number;
  readonly date: Date;
  readonly userId: number;
  readonly companyId: number;
}
