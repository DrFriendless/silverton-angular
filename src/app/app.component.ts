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
  types: readonly CommodityDefinition[];
  players: Player[] = [];
  clicks = new EventEmitter<Click>();
  round = 1;
  history: Round[] = [];
  commodityIndex = {} as Record<CommodityKey, CommodityDefinition>;

  ngOnInit(): void {
    this.clicks.subscribe((click: Click) => {
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
    this.types = buildCommodityTypes(scenario, playerCount);
    this.types.forEach(type => this.commodityIndex[type.id] = type);
    console.log(this.commodityIndex);
    this.history.push(buildNewRound(this.round, this.commodityIndex));
    this.startTableVisible = false;
    this.priceTableVisible = true;
    this.buttonTableVisible = true;
  }

  prevRound(): void {
    if (this.round > 1) this.round--;
  }

  nextRound(): void {
    const newPriceIndexes = this.endOfRound(this.history[this.round - 1]);
    this.round++;
    if (this.history.length < this.round) {
      this.history.push(buildNewRound(this.round, this.commodityIndex));
    }
    const newRound = this.history[this.round-1];
    for (const commodity in newPriceIndexes) {
      const key = commodity as CommodityKey;
      const cdef: CommodityDefinition = this.commodityIndex[key];
      newRound.commodities[key].priceIndex = newPriceIndexes[key];
      newRound.prices[key] = cdef.prices[newPriceIndexes[key]] as number;
      // future price indexes and prices might still be incorrect, but we'll fix them when we get to them.
    }
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

// the first round is 1
function buildNewRound(number: number, commodityIndex: Record<CommodityKey, CommodityDefinition>): Round {
  // TODO - any way to get rid of these casts?
  const commodities = {} as Record<CommodityKey, SeasonSales>;
  const prices = {} as Record<CommodityKey, number>;
  for (const type in commodityIndex) {
    const key = type as CommodityKey;
    const sr = newSeason();
    commodities[key] = newSeason();
    if (number === 1) {
      sr.priceIndex = commodityIndex[key].start;
      const p = commodityIndex[key].prices[sr.priceIndex];
      prices[key] = p as number;
    }
  }
  return { number, commodities, prices, idn: INCREASED_DEMAND_NUMBER[number - 1] };
}

function buildCommodityTypes(scenario: ScenarioType, playerCount: UpTo6): readonly CommodityDefinition[] {
  const index = {} as Record<CommodityKey, CommodityDefinition>;
  commodityTypes.forEach(type => index[type.id] = type);
  switch (scenario) {
    case 'denversolo':
      index.silverslc.start -= 2;
      index.lumberslc.start -= 2;
      index.lumbersantafe.start -= 2;
      index.coalslc.start -= 2;
      index.coalsantafe.start -= 2;
      return commodityTypes;
    case 'slcsolo':
      index.silverdenver.start -= 2;
      index.lumberdenver.start -= 2;
      index.lumberpueblo.start -= 2;
      index.lumbersantafe.start -= 2;
      index.coaldenver.start -= 2;
      index.coalpueblo.start -= 2;
      index.coalsantafe.start -= 2;
      return commodityTypes;
    case 'normal':
      return commodityTypes.filter(t => t.minPlayers <= playerCount);
  }
}
