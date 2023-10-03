import { DiscardType } from '@prisma/client';

export class NewDiscardEvent {
  constructor(
    public userId: number,
    public companyId: number,
    public type: DiscardType,
    public points: number,
  ) {}
}
