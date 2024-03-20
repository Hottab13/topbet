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
import { CuponMatch } from './cuponMatch.model';
import { DataTypes } from 'sequelize';

interface ICuponMatchItem {
  readonly sportId: number;
  readonly matchId: number;
  readonly tournamentId: number;
  readonly gruppName: string;
  readonly service: string;
  readonly nameTournaments: string;
  readonly coefficient: number;
  readonly oddName: string;
  readonly dateOfMatch: number;
  readonly awayTeamName: string;
  readonly homeTeamName: string;
  matchScore?: { Sc1: number; Sc2: number };
  periodsScore?: { Sc1: number; Sc2: number }[];
  status?: string;
}

interface CuponCreationAttrs {
  /*gruppName: string;
  sportId: number;
  service: string;
  nameTournaments: string;
  tournamentId: number;
  coefficient: number;
  matchId: number;
  dateOfMatch: number;
  oddName: string;
  awayTeamName: string;
  homeTeamName: string;*/
  matchsCupons: Array<ICuponMatchItem>;
  possible: number;
  betAmount: number;
  userId: number;
  сurrency: string;
  typeOdd: string;
  generateId: number;
}

@Table({ tableName: 'cupon' })
export class Cupon extends Model<Cupon, CuponCreationAttrs> {
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
    // primaryKey: true,
  })
  generateId: number;

  @Column({ type: DataType.ARRAY(DataTypes.JSONB), allowNull: false })
  matchsCupons: Array<ICuponMatchItem>;

  @ApiProperty({ example: 'Ordinary', description: 'Type Odd' })
  @Column({ type: DataType.STRING, allowNull: false })
  typeOdd: string;

  @ApiProperty({ example: 'Ordinary', description: 'Type Odd' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true, allowNull: false })
  isOpen: boolean;

  @ApiProperty({ example: false, description: 'Is Win?' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false, allowNull: false })
  isWin: boolean;

  @ApiProperty({ example: 'USD', description: 'Currency' })
  @Column({ type: DataType.STRING, allowNull: false })
  сurrency: string;

  @ApiProperty({ example: 155046, description: 'Players potential winnings' })
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  possible: number;

  @ApiProperty({ example: 1000, description: 'Bet without odds' })
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  betAmount: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => CuponMatch)
  cuponMatch: CuponMatch[];
}
