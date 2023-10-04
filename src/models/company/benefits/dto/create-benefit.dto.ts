import { IsOptional, IsString, Length } from 'class-validator';

export class CreateBenefitDto {
  @IsString()
  @Length(3, 50)
  readonly name: string;

  readonly points: number;

  @IsString()
  @IsOptional()
  readonly description: string;

  readonly companyId: number;

  readonly active: boolean;
}
