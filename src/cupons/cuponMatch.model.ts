import { ApiProperty } from '@nestjs/swagger';
import {
  Model,
  Table,
  DataType,
  Column,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Cupon } from './cupons.model';

interface CuponCreationAttrs {
  gruppName: string;
  sportId: number;
  service: string;
  nameTournaments: string;
  tournamentId: number;
  coefficient: number;
  matchId: number;
  dateOfMatch: number;
  oddName: string;
  awayTeamName: string;
  homeTeamName: string;
  cuponId: number;
}

@Table({ tableName: 'cupon_match' })
export class CuponMatch extends Model<CuponMatch, CuponCreationAttrs> {
  @ApiProperty({ example: '1', description: 'CuponMatch ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Dallas Stars (cyber)',
    description: 'Home Team Name',
  })
  @Column({ type: DataType.STRING , allowNull: false})
  homeTeamName: string;

  @ApiProperty({
    example: 'Washington Capitals (cyber)',
    description: 'Away Team Name',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  awayTeamName: string;

  @ApiProperty({ example: 'X', description: 'Odd Name' })
  @Column({ type: DataType.STRING, allowNull: false })
  oddName: string;

  @ApiProperty({ example: 1876547547457, description: 'Date Of Match' })
  @Column({
    type: DataType.INTEGER, allowNull: false
  })
  dateOfMatch: number;

  @ApiProperty({ example: 1543538, description: 'MatchId' })
  @Column({
    type: DataType.INTEGER, allowNull: false
  })
  matchId: number;

  @ApiProperty({ example: 4.3, description: 'Coefficient' })
  @Column({
    type: DataType.FLOAT, allowNull: false
  })
  coefficient: number;

  @ApiProperty({ example: 1834213, description: 'TournamentId' })
  @Column({
    type: DataType.INTEGER, allowNull: false
  })
  tournamentId: number;

  @ApiProperty({ example: 18, description: 'Sport ID' })
  @Column({
    type: DataType.INTEGER, allowNull: false
  })
  sportId: number;

  @ApiProperty({
    example: 'live',
    description: 'Service status',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  service: string;

  @ApiProperty({
    example: 'The FA Women Super League',
    description: 'Tarnament name',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  nameTournaments: string;

  @ApiProperty({ example: '1X2', description: 'Coefficient group name' })
  @Column({ type: DataType.STRING, allowNull: false })
  gruppName: string;

  @ForeignKey(() => Cupon)
  @Column({
    type: DataType.INTEGER,
  })
  cuponId: number;

  @BelongsTo(() => Cupon)
  cupon: Cupon;
}
