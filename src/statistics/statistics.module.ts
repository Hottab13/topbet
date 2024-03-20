import { Module, forwardRef } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Statistics } from './statistics.model';
import { CryptomusModule } from 'src/cryptomus/cryptomus.module';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService],
  imports:[
    SequelizeModule.forFeature([Statistics]),
    forwardRef(() => CryptomusModule),
  ]
})
export class StatisticsModule {}
