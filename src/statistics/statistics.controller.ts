import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { JwtGuard } from 'src/auth/guard/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { GetAllDto } from './dto/get-all.dto';
import { AddViewDto } from './dto/add-view.dto';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  @UseGuards(JwtGuard)
  @Post('/all')
  getAll(@Body() getAllDto: GetAllDto) {
    return this.statisticsService.getAllStatisticsService(getAllDto);
  }

  @UseGuards(JwtGuard)
  @Post('/payments-succsess')
  paymentsSuccsess(@Body() getAllDto: GetAllDto) {
    return this.statisticsService.paymentsSuccsessService(getAllDto);
  }

  @Post('/add-view')
  addView(@Body() addViewDto: AddViewDto) {
    return this.statisticsService.addViewService(addViewDto);
  }
}
