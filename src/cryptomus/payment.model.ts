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


interface PaymentCreationAttrs {
  order_id: string;
  amount: number;
  currency: string;
  userId:number;
  uuid:string;
  is_final:boolean;
  status:string;
  paymentUrl:string;
  network:string;
  address:string;
  сountry: string;
  generateId:number;
}

@Table({ tableName: 'payment' })
export class Payment extends Model<Payment, PaymentCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Cupon ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: '123456', description: 'Generated User ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
  })
  generateId: number;

  @ApiProperty({ example: "1", description: 'Order ID in your system' })
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  order_id: string;

  @ApiProperty({ example: "8b03432e-385b-4670-8d06-064591096795", description: 'uuid of the invoice.' })
  @Column({
    type: DataType.STRING,
  })
  uuid:string;

  @ApiProperty({ example: "https://pay.cryptomus.com/pay/26109ba0-b05b-4ee0-93d1-fd62c822ce95", description: 'Payment page URL' })
  @Column({
    type: DataType.STRING,
  })
  paymentUrl:string;

  @ApiProperty({ example: "tron", description: 'Blockchain network code' })
  @Column({
    type: DataType.STRING,
  })
  network:string;

  @ApiProperty({ example: "15", description: 'Amount to be paid.' })
  @Column({
    type: DataType.FLOAT,
  })
  amount: number;

  @ApiProperty({ example: "USD", description: 'Currency code' })
  @Column({
    type: DataType.STRING,
  })
  currency: string;

  @ApiProperty({ example: "Suucsess", description: 'Status' })
  @Column({
    type: DataType.STRING,
  })
  status: string;

  @ApiProperty({ example: false, description: 'Is the invoice completed?' })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  is_final:boolean;

  @ApiProperty({ example: "Suucsess", description: 'User wallet address' })
  @Column({
    type: DataType.STRING,
  })
  address:string;

  @ApiProperty({ example: 'RU', description: 'User country' })
  @Column({ type: DataType.STRING})
  сountry: string;
  
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

}
