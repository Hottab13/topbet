class CuponMatchItem {
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
}

export class CuponDto {
  readonly matchsCupons: Array<CuponMatchItem>;
  readonly possible: number;
  readonly betAmount: number;
  readonly userId: number;
  readonly сurrency: string;
  readonly typeOdd: string;
  generateId: number;
}
