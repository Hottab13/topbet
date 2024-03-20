import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class RestorePasswordDto {
    @ApiProperty({
      example: 'user@gmail.com',
      description: 'User Email',
    })
    @IsEmail({}, { message: 'Incorrect Email' })
    @IsString({ message: 'Required type string' })
    readonly email: string;
  }