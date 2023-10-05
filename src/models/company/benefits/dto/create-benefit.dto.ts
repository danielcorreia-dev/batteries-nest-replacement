import { IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';

export class CreateBenefitDto {
  @IsString()
  @Length(3, 50)
  readonly name: string;

  @IsNumber()
  @Min(1)
  readonly points: number;

  @IsString()
  @IsOptional()
  readonly description: string;

  readonly companyId: number;

  readonly active: boolean;
}
