import { ApiProperty } from '@nestjs/swagger';
import {
  Model,
  Table,
  DataType,
  Column,
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { User } from 'src/users/users.model';

interface FailedPaymentCreationAttrs {
  order_id: string;
  uuid: string;
  amount: number;
  currency: string;
  status: string;
  userId: number;
}

@Table({ tableName: 'failed-payment' })
export class FailedPayment extends Model<
  FailedPayment,
  FailedPaymentCreationAttrs
> {
  @ApiProperty({ example: '1', description: 'Cupon ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: '1', description: 'Order ID in your system' })
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  order_id: string;

  @ApiProperty({
    example: '8b03432e-385b-4670-8d06-064591096795',
    description: 'uuid of the invoice.',
  })
  @Column({
    type: DataType.STRING,
  })
  uuid: string;

  @ApiProperty({ example: '15', description: 'Amount to be paid.' })
  @Column({
    type: DataType.NUMBER,
  })
  amount: number;

  @ApiProperty({ example: 'USD', description: 'Currency code' })
  @Column({
    type: DataType.STRING,
  })
  currency: string;

  @ApiProperty({ example: 'Suucsess', description: 'Status' })
  @Column({
    type: DataType.STRING,
  })
  status: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
