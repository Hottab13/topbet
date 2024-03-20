import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { Cupon } from 'src/cupons/cupons.model';
import { FastApiService } from 'src/fast-api/fast-api.service';

interface MatchMap {
  matchTime: number | null;
  awayTeamName: string;
  dateOfMatch: number;
  homeTeamName: string;
  matchScore: { Sc1: string; Sc2: string };
  periodsScore: any;
  status: string;
}

interface TournamentMapType {
  categoryKey: string;
  categoryName: string;
  matchMap: { MatchMap: MatchMap };
  tournamentKey: string;
  tournamentName: string;
}

interface ResultsAllTypes {
  sportId: number;
  sportKey: string;
  sportName: string;
  sportTagKey: string;
  tournamentMap: { TournamentMapType: TournamentMapType };
}

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Cupon) private cuponRepositore: typeof Cupon,
    private fastApiService: FastApiService,
  ) {}

 /* @Cron('5 * * * * *')
  async searchResults() {
    const date = new Date(new Date().setDate(new Date().getDate() - 1));
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    console.log(`${day}/${month}`);
    const result: { ResultsAllTypes: ResultsAllTypes } =
      await this.fastApiService.getResultsAllService({
        date: `${day}/${month}`,
      });
    const cuponsOpen = await this.cuponRepositore.findAll({
      where: { isOpen: true },
      include: { all: true },
    });
    cuponsOpen.forEach( (cupon) => {
      const newMatchCupon = cupon.matchsCupons.find(
        (match) => new Date(match.dateOfMatch * 1000) <= new Date(),
      );
      const resSport = Object.values(result).find(
        (s) => s.sportId == newMatchCupon.sportId,
      );
      if (resSport) {
        Object.values(resSport.tournamentMap).map((t) => {
          const keyObj = Object.keys(t.matchMap).find(
            (id) => Number(id) == newMatchCupon.matchId,
          );
          const resultDataMatch = t.matchMap[keyObj];
          if(resultDataMatch){
          newMatchCupon.matchScore = resultDataMatch.matchScore;
          newMatchCupon.periodsScore = resultDataMatch.periodsScore;
          newMatchCupon.status = resultDataMatch.status;
          cupon.matchsCupons=[newMatchCupon]
          }
          // newMatchCupon. t.matchMap[keyObj]
          if (resultDataMatch) console.log(resultDataMatch);
          //if (keyObj) console.log(keyObj);
        });
      }
    });
   // await cuponsOpen.save();
  }*/
}
