import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CuponsService } from './cupons.service';
import { CuponDto } from './dto/cupon.dto';
import { CuponIdDto } from './dto/sell-cupon.dto';
import { JwtGuard } from 'src/auth/guard/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { CuponsPayloadDto } from './dto/cupons-payload-dto.dto';

@ApiTags('Cupons')
@Controller('cupons')
export class CuponsController {
  constructor(private cuponsService: CuponsService) {}

  @UseGuards(JwtGuard)
  //@Roles('ADMIN')
  //@UseGuards(RolesGuard)
    @Post("/all")
    getAll(@Body() cuponsPayloadDto:CuponsPayloadDto) {
    return this.cuponsService.getAllCupons(cuponsPayloadDto);
  }

  @UseGuards(JwtGuard)
  @Get(`/get-cupons-user`)
  getCuponsUser(@Request() req) {
    return this.cuponsService.getCuponsUserService(req.user);
  }
  @UseGuards(JwtGuard)
  @Post(`/sell-cupon`)
  sellCupon(@Request() req, @Body() cuponIdDto: CuponIdDto) {
    return this.cuponsService.sellCuponService(req.user, cuponIdDto);
  }
  @UseGuards(JwtGuard)
  @Post(`/add`)
  addCupons(@Request() req, @Body() cuponDto: CuponDto[]) {
    return this.cuponsService.addCuponsService(req.user, cuponDto);
  }
  @UseGuards(JwtGuard)
  @Get(`/get-cupon/:cuponId`)
  getCupon(@Param(`cuponId`) cuponId: string) {
    return this.cuponsService.getCuponService(cuponId);
  }
}
