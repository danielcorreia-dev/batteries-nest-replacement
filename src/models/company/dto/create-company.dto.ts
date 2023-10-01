import { IsEmail, IsString, Length } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(4, 20)
  username: string;

  @IsString()
  password: string;

  openingHours: string;

  closeHours: string;

  phone: string;

  zip: string;

  number: string;

  addressComplement: string;
}
