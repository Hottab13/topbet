import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cupon } from './cupons.model';
import { CuponDto } from './dto/cupon.dto';
import { User } from 'src/users/users.model';
import { CuponIdDto } from './dto/sell-cupon.dto';
import { CuponsPayloadDto } from './dto/cupons-payload-dto.dto';
import { Op } from 'sequelize';
const crypto = require('crypto');

@Injectable()
export class CuponsService {
  constructor(
    @InjectModel(Cupon) private cuponRepositore: typeof Cupon,
    @InjectModel(User) private userRepositore: typeof User,
  ) {}

  async getAllCupons(cuponsPayloadDto: CuponsPayloadDto) {
    const whereCondition: any = {
      include: {
        model: User,
        attributes:['generateId']
    },
      order: [['createdAt', 'DESC']],
      where: {
        createdAt: {
          [Op.between]: [cuponsPayloadDto.start, cuponsPayloadDto.end],
        },
      },
    };
    if (cuponsPayloadDto.cuponId) {
      whereCondition.where =
        (whereCondition.where, { generateId: cuponsPayloadDto.cuponId });
    }
    const cupons = await this.cuponRepositore.findAll(whereCondition);
    return { cupons: cupons };
  }

  async getCuponsUserService(req: { id: number; email: string }) {
    const cuponsRes = await this.cuponRepositore.findAll({
      where: { userId: req.id },
     // include: { all: true },
    });
    return { cupons: cuponsRes };
  }
  async sellCuponService(
    req: { id: number; email: string },
    cuponIdDto: CuponIdDto,
  ) {
    const cupon = await this.cuponRepositore.findOne({
      where: { id: cuponIdDto.cuponId },
    });
    const user = await this.userRepositore.findByPk(req.id);
    if (!cupon || !user) {
      throw new HttpException(
        'Coupon or user not found',
        HttpStatus.BAD_REQUEST,
      );
    }
    const sellForBet = Math.round(cupon.betAmount - cupon.betAmount * 0.2);
    cupon.isOpen = false;
    user.balance += sellForBet;
    await cupon.save();
    await user.save();
    return {
      message: `Coupon successfully sold for ${sellForBet}!`,
    };
  }
  async addCuponsService(
    req: { id: number; email: string },
    cuponDto: CuponDto[],
  ) {
    const user = await this.userRepositore.findByPk(req.id);
    if (!user) {
      throw new HttpException('User is not found', HttpStatus.BAD_REQUEST);
    }
    const totalBet = await this.isPossibleBet(cuponDto, user);
    user.balance = user.balance - totalBet;
    await user.save();
    cuponDto.forEach((odd) => {
      const generateId: number = crypto.randomInt(100000, 999999);
      return (odd.generateId = generateId);
    });

    const cupon = await this.cuponRepositore.bulkCreate(cuponDto, {
      returning: true,
    });
    return cupon;
  }

  async getCuponService(cuponId: string) {
    const cupon = await this.cuponRepositore.findOne({
      where: { generateId: cuponId },
    });
    if (!cupon) {
      throw new HttpException('Coupon not found', HttpStatus.BAD_REQUEST);
    }
    return cupon;
  }

  private async isPossibleBet(cuponDto: CuponDto[], user: User) {
    let totalBet = 0;
    cuponDto.map((cupon) => {
      totalBet += cupon.betAmount;
    });
    if (totalBet > user.balance) {
      throw new HttpException(
        `There are not enough funds on your balance, your balance is ${
          user.balance
        }, you need ${totalBet + cuponDto[0].сurrency} to bet!`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return totalBet;
  }
}
