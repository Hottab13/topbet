import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: '12345678', description: 'Password' })
  @IsString({ message: 'Required type string' })
  @Length(4, 50, { message: 'At least 4, no more than 50 characters' })
  readonly password: string;

  @ApiProperty({ example: '12345678', description: 'Password' })
  @IsString({ message: 'Required type string' })
  @Length(4, 50, { message: 'At least 4, no more than 50 characters' })
  readonly new_password: string;
}
