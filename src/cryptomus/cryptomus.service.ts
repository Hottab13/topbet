import { InjectModel } from '@nestjs/sequelize';
import { Injectable, Logger, forwardRef, Inject } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as uuid from 'uuid';
import { Payment } from './payment.model';
import { AxiosRequestConfig } from 'axios';
import { HttpService } from '@nestjs/axios';
import { FailedPayment } from './failed-payment.model';
import { SuccessPayment } from './success-payment.model';
import { UsersService } from 'src/users/users.service';
import { Cron } from '@nestjs/schedule';
import { Op } from 'sequelize';
const crypto = require('crypto');
dotenv.config();

@Injectable()
export class CryptomusService {
  private readonly merchant_id = `${process.env.CRYPTOMUS_MERCHANT}`;
  private readonly paymentApiKey = `${process.env.CRYPTOMUS_API}`;
  private readonly payoutApiKey = '';
  constructor(
    @InjectModel(Payment) private paymentRepositore: typeof Payment,
    @InjectModel(FailedPayment)
    private failedPaymentRepositore: typeof FailedPayment,
    @InjectModel(SuccessPayment)
    private successPaymentRepositore: typeof SuccessPayment,
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  async createPayment(
    amount: number,
    currency: string,
    user: { id: number; email: string },
  ) {
    try {
      const userData = await this.userService.getUser(user.id.toString());
      const payload = {
        amount: amount.toString(),
        currency,
        order_id: uuid.v4(),
      };
      /*const header = this.cryptoHeader(JSON.stringify(payload));
      const requestConfig: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/json',
          merchant: header.merchant,
          sign: header.sing,
        },
      };
      const { data }: any = this.httpService.post(
        'https://api.cryptomus.com/v1/payment',
        payload,
        requestConfig,
      );*/
      const payment = await this.paymentRepositore.create({
        userId: user.id,
        order_id: payload.order_id, //data.result.order_id,
        uuid: '26109ba0-b05b-4ee0-93d1-fd62c822ce95', // data.result.uuid,
        amount, //Number(data.result.amount),
        currency: 'USD', //data.result.currency,
        is_final: false, // data.result.is_final,
        status: 'check', // data.result.status,
        paymentUrl:
          'https://pay.cryptomus.com/pay/26109ba0-b05b-4ee0-93d1-fd62c822ce95', // data.result.url,
        network: null, // data.result.network,
        address: null, //data.result.address,
        сountry: userData.сountry||"",
        generateId: userData.generateId,
      });
      return payment;
    } catch (err) {
      throw new Error(err);
    }
  }

  @Cron('45 * * * * *')
  private async checkPayment() {
    try {
      const payments = await this.paymentRepositore.findAll();
      for (const payment of payments) {
        const payload = {
          order_id: payment.order_id,
        };
        /*const header = this.cryptoHeader(JSON.stringify(payload));
        const requestConfig: AxiosRequestConfig = {
          headers: {
            'Content-Type': 'application/json',
            merchant: header.merchant,
            sign: header.sing,
          },
        };
        const { data }: any = this.httpService.post(
          'https://api.cryptomus.com/v1/payment/info',
          payload,
          requestConfig,
        );*/
        const data = {
          result: {
            uuid: '70b8db5c-b952-406d-af26-4e1c34c27f15',
            order_id: '65bbe87b4098c17a31cff3e71e515243',
            amount: '100.00',
            payment_amount: '0.00',
            payer_amount: '15.75',
            discount_percent: -5,
            discount: '-0.75',
            payer_currency: 'USD',
            currency: 'USDT',
            comments: null,
            merchant_amount: '15.43500000',
            network: 'tron',
            address: 'TXhfYSWt2oKRrHAJVJeYRuit6ZzKuoEKXj',
            from: null,
            txid: null,
            payment_status: 'paid',
            url: 'https://pay.cryptomus.com/pay/70b8db5c-b952-406d-af26-4e1c34c27f15',
            expired_at: 1689099831,
            status: 'paid',
            is_final: true,
            additional_data: null,
            created_at: '2023-07-11T20:23:52+03:00',
            updated_at: '2023-07-11T21:24:17+03:00',
          },
        };
        if (
          data.result.status === 'cancel' ||
          data.result.status === 'system_fail' ||
          data.result.status === 'fail'
        ) {
          await this.failedPaymentRepositore.create({
            userId: payment.userId,
            order_id: payment.order_id,
            uuid: payment.uuid,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
          });
          await this.paymentRepositore.destroy({
            where: {
              id: payment.id,
            },
          });
        } else if (
          data.result.status === 'paid' ||
          data.result.status === 'paid_over' ||
          data.result.status === 'wrong_amount' ||
          data.result.status === 'wrong_amount_waiting'
        ) {
          await this.userService.updateBalanse(
            Number(data.result.amount),
            payment.userId,
          );
          const successfulDepositNotification = {
            type: 'SYSTEM',
            title: 'Deposit',
            text: `You have successfully deposited funds into your main account in the amount of ${
              data.result.amount + payment.currency
            }. We thank you for your trust and wish you a successful game!`,
          };
          await this.userService.createNotification(
            payment.userId,
            successfulDepositNotification.title,
            successfulDepositNotification.text,
            successfulDepositNotification.type,
          );
          const depositAmount = await this.successPaymentRepositore.findAll({
            where: {
              userId: payment.userId,
            },
          });

          await this.successPaymentRepositore.create({
            userId: payment.userId,
            order_id: payment.order_id,
            uuid: payment.uuid,
            amount: Number(data.result.amount),
            currency: payment.currency,
            status: data.result.status,
            network: data.result.network,
            address: data.result.address,
            сountry: payment.сountry,
            generateId: payment.generateId,
            depositAmount: depositAmount.length + 1,
          });
          await this.paymentRepositore.destroy({
            where: {
              id: payment.id,
            },
          });
        }
      }
      Logger.log('Succsess');
    } catch (err) {
      Logger.error('Err payment');
      throw new Error(err);
    }
  }

  public async getAllPatmentSuccsess(start: Date, end: Date) {
    const whereCondition: any = {
      order: [['createdAt', 'DESC']],
      where: {
        createdAt: {
          [Op.between]: [start, end],
        },
      },
    };
    const patmentsSuccsess =
      await this.successPaymentRepositore.findAll(whereCondition);
    return patmentsSuccsess;
  }
  public async getQuantityUserDeposits(userId: number) {
    const userDeposits = await this.successPaymentRepositore.findAll({
      where: {
        userId:userId,
      },
    });
    return userDeposits.length;
  }
  private cryptoHeader(payload: string) {
    const sing = crypto
      .createHash('md5')
      .update(Buffer.from(payload).toString('base64') + this.paymentApiKey)
      .digest('hex');
    return {
      merchant: this.merchant_id,
      sing,
    };
  }
}
