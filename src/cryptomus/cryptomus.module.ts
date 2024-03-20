import { Module, forwardRef } from '@nestjs/common';
import { CryptomusController } from './cryptomus.controller';
import { CryptomusService } from './cryptomus.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Payment } from './payment.model';
import { SuccessPayment } from './success-payment.model';
import { FailedPayment } from './failed-payment.model';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [CryptomusController],
  providers: [CryptomusService],
  imports: [
    SequelizeModule.forFeature([ Payment, SuccessPayment, FailedPayment]),
    HttpModule ,
    forwardRef(() => UsersModule),
  ],
  exports:[CryptomusService]
})
export class CryptomusModule {}

