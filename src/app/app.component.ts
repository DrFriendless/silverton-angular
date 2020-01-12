import {Component, EventEmitter, OnInit} from '@angular/core';
import {
  Click,
  CommodityDefinition,
  CommodityKey,
  Player, Price,
  Round,
  ScenarioType,
  SeasonRecord,
  SeasonSales,
  UpTo6
} from './types';
import {commodityTypes, INCREASED_DEMAND_NUMBER, nd6} from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  numPlayers: UpTo6;
  startTableVisible = true;
  priceTableVisible = false;
  buttonTableVisible = false;
  types: CommodityDefinition[];
  players: Player[] = [];
  clicks = new EventEmitter<Click>();
  round = 1;
  history: Round[] = [];
  commodityIndex: Record<CommodityKey, CommodityDefinition> = {} as Record<CommodityKey, CommodityDefinition>;

  ngOnInit(): void {
    this.clicks.subscribe((click: Click) => {
      console.log(this.history);
      const sr = this.currentRound().commodities[click.id];
      let val = this.sold(click.playerNum, click.id);
      const def = this.commodityIndex[click.id];
      if (click.plus) {
        val += def.increment;
      } else if (val > 0) {
        val -= def.increment;
      }
      sr.sold[click.playerNum.toString()] = val;
    });
  }

  currentRound(): Round {
    return this.history[this.round-1];
  }

  currentPrice(commodity: CommodityKey): number {
    if (this.history.length === 0) return 0;
    return this.currentRound().prices[commodity];
  }

  sold(player: Player, commodity: CommodityKey): number {
    if (this.history.length === 0) return 0;
    return this.currentRound().commodities[commodity].sold[player] || 0;
  }

  start(playerCount: UpTo6, scenario: ScenarioType): void {
    this.numPlayers = playerCount;
    for (let i=1; i <= playerCount; i++) this.players.push(i as Player);
    this.types = commodityTypes.filter(t => t.minPlayers <= playerCount);
    this.types.forEach(type => this.commodityIndex[type.id] = type);
    console.log(this.commodityIndex);
    this.history.push(this.newRound(this.round));
    // eval(modifier + '()');
    // build();
    this.startTableVisible = false;
    this.priceTableVisible = true;
    this.buttonTableVisible = true;
  }

  prevRound(): void {
    if (this.round > 1) {
      this.round--;
    }
  }

  nextRound(): void {
    const newPriceIndexes = this.endOfRound(this.history[this.round - 1]);
    this.round++;
    if (this.history.length <= this.round) {
      this.history.push(this.newRound(this.round));
    }
    const newRound = this.history[this.round];
    for (const commodity in newPriceIndexes) {
      const key = commodity as CommodityKey;
      const cdef: CommodityDefinition = this.commodityIndex[key];
      newRound.commodities[key].priceIndex = newPriceIndexes[key];
      newRound.prices[key] = cdef.prices[newPriceIndexes[key]] as number;
      // future price indexes and prices might still be incorrect, but we'll fix them when we get to them.
    }
    console.log(newRound);
  }

  endOfRound(round: Round): Record<CommodityKey, number> {
    const result = {} as Record<CommodityKey, number>;
    for (const commodity in round.commodities) {
      const key = commodity as CommodityKey; // yuk
      const cdef: CommodityDefinition = this.commodityIndex[key];
      const season: SeasonSales | SeasonRecord = round.commodities[key];
      let total = 0;
      for (const player in season.sold) total += season.sold[player.toString()];
      let seasonRec: SeasonRecord;
      if ('total' in season) {
        // dice have already been rolled
        seasonRec = season;
      } else {
        seasonRec = { ...season, random: nd6(cdef.d6) };
      }
      const q = seasonRec.random + Math.ceil(cdef.soldFactor * total) - cdef.idnFactor * round.idn;
      round.commodities[key] = seasonRec;
      for (const change of cdef.changes) {
        if (change.test(q)) {
          result[key] = applyPriceChange(cdef.prices, season.priceIndex, change.delta);
          break;
        }
      }
    }
    console.log(result);
    return result;
  }

  // the first round is 1
  private newRound(number: number): Round {
    // TODO - any way to get rid of these casts?
    const commodities = {} as Record<CommodityKey, SeasonSales>;
    const prices = {} as Record<CommodityKey, number>;
    for (const type of commodityTypes) {
      console.log(type.id);
      console.log(this.commodityIndex[type.id]);
      const sr = newSeason();
      commodities[type.id] = newSeason();
      if (number === 1) {
        sr.priceIndex = this.commodityIndex[type.id].start;
        const p = this.commodityIndex[type.id].prices[sr.priceIndex];
        prices[type.id] = p as number;
      }
    }
    return { number, commodities, prices, idn: INCREASED_DEMAND_NUMBER[number - 1] };
  }
}

function newSeason(): SeasonSales {
  return { sold: {}, priceIndex: 0 };
}

function applyPriceChange(prices: readonly Price[], initial: number, delta: number): number {
  let current = initial;
  if (delta >= 0) {
    for (let i=0; i < delta; i++) {
      if (current + 1 < prices.length && prices[current+1] != 'X') {
        current++;
      } else {
        break;
      }
    }
  } else {
    for (let i=0; i > delta; i--) {
      if (current > 0 && prices[current-1] != 'X') {
        current--;
      } else {
        break;
      }
    }
  }
  return current;
}

