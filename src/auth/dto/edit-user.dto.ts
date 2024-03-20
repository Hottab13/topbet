import { IsString, Length } from 'class-validator';

export class EditUserDto {
  @IsString({ message: 'Required type string' })
  readonly name: string;

  @IsString({ message: 'Required type string' })
  @Length(4, 50, { message: 'At least 4, no more than 50 characters' })
  readonly surname: string;

  @IsString({ message: 'Required type string' })
  @Length(4, 50, { message: 'At least 4, no more than 50 characters' })
  readonly сountry: string;

  @IsString({ message: 'Required type string' })
  dateOfBirth: string;
}
