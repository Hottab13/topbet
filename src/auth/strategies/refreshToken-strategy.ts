import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy,"jwt-refresh") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField("refreshToken"),
      ignoreExpiration: false,
      secretOrKey: `${process.env.PRIVATE_KEY}`,
    });
  }

  async validate(payload: any) {
    return { id: payload.id, email: payload.email };
  }
}
