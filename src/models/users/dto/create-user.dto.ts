import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(4, 20)
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(8, 20)
  readonly password: string;
}
