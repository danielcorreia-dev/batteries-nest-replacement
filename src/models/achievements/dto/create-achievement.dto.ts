import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreateAchievementDto {
  @IsString()
  @Length(3, 50)
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly icon: string;

  @IsNumber()
  @IsOptional()
  readonly requiredPoints: number;
}
