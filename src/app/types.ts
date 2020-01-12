export const enum PlayerNumber {}

export type UpTo6 = 1 | 2 | 3 | 4 | 5 | 6;

export type Player = UpTo6 & PlayerNumber;

export type Predicate = (n: number) => boolean;

export type ChangesDefinition = readonly { test: Predicate; delta: number }[];

export type ScenarioType = 'normal' | 'slcsolo' | 'denversolo';

export type Commodity = 'Gold' | 'Silver' | 'Lumber' | 'Coal';

export type Location = 'Any Market' | 'Santa Fe' | 'Denver' | 'SLC' | 'Pueblo';

export type Price = number | 'X';

export type CommodityKey = 'gold' | 'silverdenver' | 'silverslc' | 'lumberdenver' | 'lumberslc' | 'lumberpueblo' |
  'lumbersantafe' | 'coaldenver' | 'coalslc' | 'coalpueblo' | 'coalsantafe';

export interface SeasonSales {
  // the number of this commodity sold by each player in this season
  sold: Record<string, number>;
  // the index into the price table for this commodity at the start of the season
  priceIndex: number;
}

export interface SeasonRecord extends SeasonSales {
  // the random number rolled for this commodity in this season
  random: number;
}

export interface CommodityDefinition {
  id: CommodityKey;
  commodity: Commodity;
  location: Location;
  prices: readonly Price[];
  start: number;
  max: number;
  minPlayers: UpTo6;
  increment: number;
  changes: ChangesDefinition;
  d6: number;
  soldFactor: number;
  idnFactor: number;
  order: number;
}

export interface Click {
  id: CommodityKey;
  playerNum: Player;
  plus: boolean;
}

export interface Round {
  number: number;
  commodities: Record<CommodityKey, SeasonSales | SeasonRecord>;
  prices: Record<CommodityKey, number>;
  idn: number;
}
