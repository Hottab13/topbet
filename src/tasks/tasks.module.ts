import { Module, forwardRef } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cupon } from 'src/cupons/cupons.model';
import { FastApiModule } from 'src/fast-api/fast-api.module';

@Module({
  providers: [TasksService],
  imports:[
    SequelizeModule.forFeature([Cupon]),
    forwardRef(() => FastApiModule),
  ]
})
export class TasksModule {}
