import { ApiProperty } from '@nestjs/swagger';
import {
  Model,
  Table,
  DataType,
  Column,
  BelongsToMany,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from 'src/users/users.model';
import { Role } from './roles.model';


@Table({ tableName: 'user-roles', createdAt:false, updatedAt:false })
export class UserRoles extends Model<UserRoles> {
  @ApiProperty({ example: '1', description: 'Unique ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(()=>User)
  @Column({ type: DataType.INTEGER })
  roleId: number;

  @ForeignKey(()=>Role)
  @Column({ type: DataType.INTEGER })
  userId: number;

  
 

  
}
