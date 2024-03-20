import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as uuid from 'uuid';
import { InjectModel } from '@nestjs/sequelize';

import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.model';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RestorePasswordDto } from './dto/restore-password.dto';
import { RestoreResetPassworddDto } from './dto/restore-reset-password.dto';
import { EditUserDto } from './dto/edit-user.dto';
import { Role } from 'src/roles/roles.model';
import { Statistics } from 'src/statistics/statistics.model';
const crypto = require('crypto');

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userRepositore: typeof User,
    @InjectModel(Statistics) private statisticsRepositore: typeof Statistics,
    private userService: UsersService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async login(
    user: User,
    geolocationUserPayload: { ipv4: string; countrycode: string },
  ): Promise<any> {
    // const user = await this.validateUser(userDto.email, userDto.password);
    const userData = await this.userService.getUserByEmail(user.email);
    await userData.update({
      IPv4: geolocationUserPayload.ipv4,
      countryCode: geolocationUserPayload.countrycode,
    });
    if (geolocationUserPayload.ipv4 && geolocationUserPayload.countrycode) {
      await this.statisticsRepositore.create({
        IPv4: geolocationUserPayload.ipv4,
        countryCode: geolocationUserPayload.countrycode,
        type: 'AUTH',
      });
    }
    const accessToken = await this.generateTokenJWT(
      user.id,
      user.email,
      user.role,
    );
    const refreshToken = await this.generateRefreshTokenJWT(
      user.id,
      user.email,
      user.role,
    );
    return {
      ...user,
      accessToken,
      refreshToken,
    };
  }
  async refreshToken(user: User) {
    const accessToken = await this.generateTokenJWT(
      user.id,
      user.email,
      user.role,
    );
    return {
      accessToken,
    };
  }
  async checkUserService(user: User): Promise<any> {
    const userData = await this.userService.getUserByEmail(user.email);
    const { password, activLink, ...result } = userData.dataValues;
    const accessToken = await this.generateTokenJWT(
      user.id,
      user.email,
      userData.role,
    );
    return {
      ...result,
      accessToken,
    };
  }
  async registrationService(
    userDto: CreateUserDto,
    geolocationUserPayload: { ipv4: string; countrycode: string },
  ) {
    const activLink = uuid.v4();
    const generateId = crypto.randomInt(100000, 999999);
    const condidate = await this.userService.getUserByEmail(userDto.email);
    if (condidate) {
      throw new HttpException(
        'A user with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPass = await bcrypt.hash(userDto.password, 5);
    await this.userService.createUser({
      ...userDto,
      password: hashPass,
      activLink,
      generateId,
    });
    if (geolocationUserPayload.ipv4 && geolocationUserPayload.countrycode) {
      await this.statisticsRepositore.create({
        IPv4: geolocationUserPayload.ipv4,
        countryCode: geolocationUserPayload.countrycode,
        type: 'REGISTRATION',
      });
    }
    this.sendActivationMail(
      userDto.email,
      `${process.env.API_URL}/auth/activate/${activLink}`,
    );
    const user = await this.validateUser(userDto.email, userDto.password);
    const accessToken = await this.generateTokenJWT(user.id, user.email);
    const refreshToken = await this.generateRefreshTokenJWT(
      user.id,
      user.email,
    );
    return {
      ...user,
      accessToken,
      refreshToken,
    };
  }
  async restoreResetPasswordService(restPassDto: RestoreResetPassworddDto) {
    const verifyToken = this.jwtService.verify(restPassDto.token);
    const user = await this.userRepositore.findByPk(verifyToken.id);
    if (!verifyToken || !user) {
      throw new HttpException(
        `Invalid token or user not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPass = await bcrypt.hash(restPassDto.password, 5);
    user.password = hashPass;
    await user.save();

    return {
      message: `Password successfully restored!`,
    };
  }
  async restorePasswordService(emailDto: RestorePasswordDto) {
    const user = await this.userService.getUserByEmail(emailDto.email);
    if (!user) {
      throw new HttpException(
        `Email ${emailDto.email} not registered`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const payload = {
      id: user.id,
    };
    const userRestorPassJWT = this.jwtService.sign(payload);
    this.sendRestorePasswordServiceMail(
      user.email,
      `${process.env.CLIENT_URL}/reset/${userRestorPassJWT}`,
    );
    return {
      message: `Restore/reset link sent to email ${emailDto.email} address`,
    };
  }
  async changePasswordService(
    req: { id: number; email: string },
    passwordUserDto: ChangePasswordDto,
  ) {
    const user = await this.userService.getUserByEmail(req.email);
    if (passwordUserDto.password == passwordUserDto.new_password) {
      throw new HttpException(
        `The new password must be different from the previous password`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (await bcrypt.compare(passwordUserDto.password, user.password)) {
      const hashPass = await bcrypt.hash(passwordUserDto.new_password, 5);
      user.password = hashPass;
      await user.save();
      return {
        message: `Password successfully updated!`,
      };
    }
    throw new HttpException(`Invalid user password!`, HttpStatus.BAD_REQUEST);
  }
  async getActivateService(activLink: string) {
    const user = await this.userRepositore.findOne({ where: { activLink } });
    if (!user) {
      throw new HttpException(
        'Incorrect activation link!',
        HttpStatus.BAD_REQUEST,
      );
    }
    user.isActivated = true;
    await user.save();
    return { url: process.env.CLIENT_URL };
  }
  async editUserDataService(
    req: { id: number; email: string },
    editUserDto: EditUserDto,
  ): Promise<any> {
    const user = await this.userService.getUserByEmail(req.email);
    if (!user) {
      throw new HttpException(
        `User ${req.email} not found!`,
        HttpStatus.BAD_REQUEST,
      );
    }
    user.name = editUserDto.name;
    user.surname = editUserDto.surname;
    user.сountry = editUserDto.сountry;
    user.dateOfBirth = editUserDto.dateOfBirth;
    const res = await user.save();
    const { password, activLink, ...result } = res.dataValues;
    return {
      ...result,
    };
  }
  private async generateTokenJWT(id: number, email: string, role?: Role[]) {
    const payload = {
      id,
      email,
      role: role || '',
    };
    return this.jwtService.sign(payload);
  }
  private async generateRefreshTokenJWT(
    id: number,
    email: string,
    role?: Role[],
  ) {
    const payload = {
      id,
      email,
      role: role || '',
    };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }
  async validateUser(
    email: string,
    password: string,
  ): Promise<{
    id: number;
    balance: number;
    generateId: number;
    name: string;
    surname: string;
    email: string;
    banned: boolean;
    banReason: string;
    сountry: string;
    dateOfBirth: string;
  }> {
    const user = await this.userService.getUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, activLink, ...result } = user.dataValues;
      return result;
    }
    return null;
  }
  public sendActivationMail(to: string, link: string): void {
    this.mailerService
      .sendMail({
        to, // list of receivers
        from: process.env.SMTP_USER, // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        html: `
            <div>
            <h1>To activate your account, follow the link </h1>
            <a href="${link}">Activate</a>
            </div>
            `, // HTML body content
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        //console.log(err);
        new HttpException('Mail server sending error', HttpStatus.BAD_REQUEST);
      });
  }
  public sendRestorePasswordServiceMail(to: string, link: string): void {
    this.mailerService
      .sendMail({
        to, // list of receivers
        from: process.env.SMTP_USER, // sender address
        subject: 'Restore Password', // Subject line
        text: 'welcome', // plaintext body
        html: `
        <div>
            <p>Hi,</p>
            <p>You requested to reset your password.</p>
            <p> Please, click the link below to reset your password</p>
            <a href="${link}">Reset Password</a>
        </div>

            `, // HTML body content
      })
      .catch(() => {
        //console.log(err);
        new HttpException('Mail server sending error', HttpStatus.BAD_REQUEST);
      });
  }
}
