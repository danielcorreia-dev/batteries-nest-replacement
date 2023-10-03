import { IsBase64, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsBase64()
  @IsOptional()
  readonly avatar: any;

  @IsString()
  readonly name: string;

  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  newPassword: string;

  @IsString()
  @IsOptional()
  readonly bio: string;
}
