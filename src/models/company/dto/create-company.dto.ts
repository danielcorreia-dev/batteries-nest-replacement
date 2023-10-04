import { IsEmail, IsString, Length } from 'class-validator';

export class CreateCompanyDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(4)
  name: string;

  @IsString()
  password: string;
}
