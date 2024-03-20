import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Statistics } from './statistics.model';
import { GetAllDto } from './dto/get-all.dto';
import { Op } from 'sequelize';
import { AddViewDto } from './dto/add-view.dto';
import { CryptomusService } from 'src/cryptomus/cryptomus.service';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(Statistics)
    private statisticsRepositore: typeof Statistics,
    private readonly cryptomusService: CryptomusService,
  ) {}

  async getAllStatisticsService(getAllDto: GetAllDto) {
    const whereCondition: any = {
      order: [['createdAt', 'DESC']],
      where: {
        createdAt: {
          [Op.between]: [getAllDto.start, getAllDto.end],
        },
      },
    };
    const statistics = await this.statisticsRepositore.findAll(whereCondition);
    return { statistics };
  }

  async paymentsSuccsessService(getAllDto: GetAllDto) {
    const paymentsSuccsess = await this.cryptomusService.getAllPatmentSuccsess(
      getAllDto.start,
      getAllDto.end,
    );
    return { paymentsSuccsess };
  }

  async addViewService(addViewDto: AddViewDto) {
    await this.createStatisticsView(addViewDto);
  }

  private async createStatisticsView(payload: AddViewDto) {
    if (
      payload.IPv4 &&
      payload.country_code &&
      !(await this.statisticsRepositore.findOne({
        where: {
          IPv4: payload.IPv4,
          type: 'VIEW',
          createdAt: {
            [Op.between]: [
              new Date(new Date().setDate(new Date().getDate() - 1)),
              new Date(),
            ],
          },
        },
      }))
    ) {
      await this.statisticsRepositore.create({
        IPv4: payload.IPv4,
        countryCode: payload.country_code,
        type: 'VIEW',
      });
    }
  }
}
