import { Model, Table, DataType, Column } from 'sequelize-typescript';

interface StatisticsCreationAttrs {
  IPv4: string;
  countryCode: string;
  type: string;
}
@Table({ tableName: 'statistics' })
export class Statistics extends Model<Statistics, StatisticsCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING })
  type: string;

  @Column({ type: DataType.STRING, allowNull: false })
  IPv4: string;

  @Column({ type: DataType.STRING, allowNull: false })
  countryCode: string;
}
