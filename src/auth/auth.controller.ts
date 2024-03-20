import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Redirect,
  UseGuards,
  Request,
  Headers
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RestorePasswordDto } from './dto/restore-password.dto';
import { RestoreResetPassworddDto } from './dto/restore-reset-password.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { RefreshJwtGuard } from './guard/refresh-jwt-auth.guard';
import { JwtGuard } from './guard/auth.guard';
import { EditUserDto } from './dto/edit-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post(`/login`)
  async login(@Request() req, @Headers() headers) {
    const geolocationUserPayload={
      ipv4:headers.ipv4,
      countrycode:headers.countrycode,
    }
    return await this.authService.login(req.user, geolocationUserPayload);
  }
  @Post(`/registration`)
  async registration(@Body() createUserDto: CreateUserDto,@Headers() headers) {
    const geolocationUserPayload={
      ipv4:headers.ipv4,
      countrycode:headers.countrycode,
    }
    return await this.authService.registrationService(createUserDto,geolocationUserPayload);
  }
  @UseGuards(RefreshJwtGuard)
  @Post('/refresh')
  async refreshToken(@Request() req) {
    return await this.authService.refreshToken(req.user);
  }
  @Post(`/restore-password`)
  async restorePassword(@Body() emailDto: RestorePasswordDto) {
    return await this.authService.restorePasswordService(emailDto);
  }
  @UseGuards(RefreshJwtGuard)
  @Post('/check-user')
  async checkUser(@Request() req,@Headers("IPv4") headers) {
    return await this.authService.checkUserService(req.user);
  }
  @Get(`/activate/:link`)
  @Redirect()
  async getActivate(@Param(`link`) link: string) {
    return await this.authService.getActivateService(link);
  }
  @UseGuards(JwtGuard)
  @Post(`/edit-user-data`)
    async editUserData(@Request() req, @Body() editUserDto: EditUserDto) {
    return await this.authService.editUserDataService(req.user, editUserDto);
  }
  @UseGuards(JwtGuard)
  @Post(`/change-password`)
  async changePassword(@Request() req,@Body() passwordUserDto: ChangePasswordDto) {
    return await this.authService.changePasswordService(req.user,passwordUserDto);
  }

  @Post(`/restore-reset-password`)
  async restoreResetPassword(@Body() restPassDto: RestoreResetPassworddDto) {
    return await this.authService.restoreResetPasswordService(restPassDto);
  }
}
