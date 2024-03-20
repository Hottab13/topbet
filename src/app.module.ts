import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FastApiModule } from './fast-api/fast-api.module';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/users.model';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/roles.model';
import { UserRoles } from './roles/user-roles.model';
import { AuthModule } from './auth/auth.module';
import { CuponsModule } from './cupons/cupons.module';
import { Cupon } from './cupons/cupons.model';
import { CuponMatch } from './cupons/cuponMatch.model';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { StatisticsModule } from './statistics/statistics.module';
import * as dotenv from 'dotenv';
import { Statistics } from './statistics/statistics.model';
import { Payment } from './cryptomus/payment.model';
import { SuccessPayment } from './cryptomus/success-payment.model';
import { FailedPayment } from './cryptomus/failed-payment.model';
import { NotificationModel } from './users/notifications.model';
import { CryptomusModule } from './cryptomus/cryptomus.module';
import { Withdraw } from './users/withdraw.model';
dotenv.config();

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRESS_HOST,
      port: Number(process.env.POSTGRESS_PORT),
      username: process.env.POSTGRESS_USER,
      password: process.env.POSTGRESS_PASSWORD,
      database: process.env.POSTGRESS_DB,
      models: [
        User,
        Role,
        UserRoles,
        Cupon,
        CuponMatch,
        Statistics,
        Payment,
        SuccessPayment,
        FailedPayment,
        NotificationModel,
        Withdraw
      ],
      autoLoadModels: true,
    }),
    ScheduleModule.forRoot(),
    FastApiModule,
    UsersModule,
    RolesModule,
    AuthModule,
    CuponsModule,
    TasksModule,
    StatisticsModule,
    CryptomusModule,
  ],
})
export class AppModule {}
