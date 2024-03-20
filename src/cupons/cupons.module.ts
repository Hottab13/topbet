import { Module } from '@nestjs/common';
import { CuponsController } from './cupons.controller';
import { CuponsService } from './cupons.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { Cupon } from './cupons.model';
import { CuponMatch } from './cuponMatch.model';
import { RolesModule } from 'src/roles/roles.module';
import { Role } from 'src/roles/roles.model';

@Module({
  controllers: [CuponsController],
  providers: [CuponsService],
  imports:[
    SequelizeModule.forFeature([User, Cupon, Role, CuponMatch]),
    RolesModule,
  ],
  exports:[
    CuponsService
  ]
})
export class CuponsModule {}
