import {ChangesDefinition, CommodityDefinition} from './types';

export function nd6(n: number): number {
  if (n === 0) return 0;
  if (n === 1) return d6();
  return d6() + nd6(n - 1);
}

function d6(): number {
  return Math.ceil(Math.random() * 6);
}

const GOLD_CHANGES: ChangesDefinition = [
  { test: x => x <= 1, delta: 2 },
  { test: x => x <= 3, delta: 1 },
  { test: x => x <= 5, delta: 0 },
  { test: x => x <= 7, delta: -1 },
  { test: x => x > 7, delta: -2 }
];
const DENVER_SILVER_CHANGES: ChangesDefinition = [
  { test: x => x < 1, delta: 5 },
  { test: x => x === 1, delta: 4 },
  { test: x => x === 2, delta: 3 },
  { test: x => x === 3, delta: 2 },
  { test: x => x < 6, delta: 1 },
  { test: x => x < 8, delta: 0 },
  { test: x => x < 10, delta: -1 },
  { test: x => x < 12, delta: -2 },
  { test: x => x === 12, delta: -3 },
  { test: x => x === 13, delta: -4 },
  { test: x => x === 14, delta: -5 },
  { test: x => x === 15, delta: -6 },
  { test: x => x > 15, delta: -7 }
];
const SLC_SILVER_CHANGES: ChangesDefinition = [
  { test: x => x <= 1, delta: 3 },
  { test: x => x === 2, delta: 2 },
  { test: x => x === 3, delta: 1 },
  { test: x => x < 6, delta: 0 },
  { test: x => x < 8, delta: -1 },
  { test: x => x < 10, delta: -2 },
  { test: x => x < 12, delta: -3 },
  { test: x => x >= 12, delta: -4 }
];
const LUMBER_CHANGES: ChangesDefinition = [
  { test: x => x < 2, delta: 3 },
  { test: x => x < 4, delta: 2 },
  { test: x => x < 6, delta: 1 },
  { test: x => x === 6, delta: 0 },
  { test: x => x < 9, delta: -1 },
  { test: x => x < 11, delta: -2 },
  { test: x => x < 13, delta: -3 },
  { test: x => x >= 13, delta: -4 }
];
const COAL_CHANGES: ChangesDefinition = [
  { test: x => x < 2, delta: 3 },
  { test: x => x < 4, delta: 2 },
  { test: x => x < 6, delta: 1 },
  { test: x => x < 9, delta: 0 },
  { test: x => x < 11, delta: -1 },
  { test: x => x < 13, delta: -2 },
  { test: x => x >= 13, delta: -3 }
];

export const commodityTypes: readonly CommodityDefinition[] = [
  {
    commodity: 'Gold', location: 'Any Market', prices: [3000, 3500, 4000, 4500, 5000, 5000, 5500, 6000, 6500, 7000],
    start: 4, max: 9999999, minPlayers: 1, increment: 0.25, d6: 1, soldFactor: 4, idnFactor: 0, changes: GOLD_CHANGES,
    order: 1, id: 'gold' },
  {
    commodity: 'Silver', location: 'Denver', prices: [1000, 1200, 1600, 1800, 2000, 2000, 2000, 2400, 3000, 4000],
    start:5, max:9999999, minPlayers: 1, increment: 0.5, d6: 2, soldFactor: 2, idnFactor: 1, changes: DENVER_SILVER_CHANGES,
    order: 2, id: 'silverdenver' },
  {
    commodity: 'Silver', location: 'SLC', prices: [1000, 1200, 1600, 1800, 2000, 2000, 2000, 2400, 'X', 'X'],
    start:4, max:3, minPlayers: 4, increment: 0.5, d6: 1, soldFactor: 2, idnFactor: 0, changes: SLC_SILVER_CHANGES,
    order: 3, id: 'silverslc' },
  {
    commodity: 'Lumber', location: 'Denver', prices: ['X', 200, 300, 400, 500, 600, 800, 1000, 'X', 'X'],
    start:4, max:10, minPlayers: 1, increment: 1, d6: 2, soldFactor: 1, idnFactor: 1, changes: LUMBER_CHANGES,
    order: 4, id: 'lumberdenver' },
  {
    commodity: 'Lumber', location: 'SLC', prices: ['X', 'X', 'X', 400, 500, 600, 800, 1000, 1200, 1500],
    start:5, max:8, minPlayers: 2, increment: 1, d6: 2, soldFactor: 1, idnFactor: 1, changes: LUMBER_CHANGES,
    order: 5, id: 'lumberslc' },
  {
    commodity: 'Lumber', location: 'Pueblo', prices: ['X', 200, 300, 400, 500, 600, 800, 1000, 'X', 'X'],
    start:4, max:6, minPlayers: 2, increment: 1, d6: 2, soldFactor: 1, idnFactor: 1, changes: LUMBER_CHANGES,
    order: 6, id: 'lumberpueblo' },
  {
    commodity: 'Lumber', location: 'Santa Fe', prices: [150, 200, 300, 400, 500, 600, 800, 'X', 'X', 'X'],
    start:3, max:6, minPlayers: 4, increment: 1, d6: 2, soldFactor: 1, idnFactor: 1, changes: LUMBER_CHANGES,
    order: 7, id: 'lumbersantafe' },
  {
    commodity: 'Coal', location: 'Denver', prices: ['X', 'X', 150, 200, 300, 300, 400, 500, 600, 700],
    start:5, max:16, minPlayers: 1, increment: 1, d6: 2, soldFactor: 0.5, idnFactor: 1, changes: COAL_CHANGES,
    order: 8, id: 'coaldenver' },
  {
    commodity: 'Coal', location: 'SLC', prices: [100, 100, 150, 200, 300, 300, 400, 500, 'X', 'X'],
    start:4, max:16, minPlayers: 2, increment: 1, d6: 2, soldFactor: 0.5, idnFactor: 1, changes: COAL_CHANGES,
    order: 9, id: 'coalslc' },
  {
    commodity: 'Coal', location: 'Pueblo', prices: [100, 100, 150, 200, 300, 300, 400, 'X', 'X', 'X'],
    start:3, max:16, minPlayers: 1, increment: 1, d6: 2, soldFactor: 0.5, idnFactor: 1, changes: COAL_CHANGES,
    order: 10, id: 'coalpueblo' },
  {
    commodity: 'Coal', location: 'Santa Fe', prices: ['X', 100, 150, 200, 300, 300, 400, 500, 600, 'X'],
    start:4, max:16, minPlayers: 3, increment: 1, d6: 2, soldFactor: 0.5, idnFactor: 1, changes: COAL_CHANGES,
    order: 11, id: 'coalsantafe' }
];

// This comes from the board of the game.
export const INCREASED_DEMAND_NUMBER: readonly number[] = [ 0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, -1 ];
