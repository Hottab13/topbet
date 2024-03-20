import { Controller, Post, Request, UseGuards, Body } from '@nestjs/common';
import { CryptomusService } from './cryptomus.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/auth.guard';

@ApiTags('Cryptomus')
@Controller('cryptomus')
export class CryptomusController {
  constructor(private cryptomusService: CryptomusService) {}

  @UseGuards(JwtGuard)
  @Post('create-payment')
  async createPayment(@Body() dto: any, @Request() req) {
    return await this.cryptomusService.createPayment(
      dto.amount,
      dto.currency,
      req.user,
    );
  }
}
