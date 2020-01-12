import {Component, EventEmitter, Input} from '@angular/core';
import {Click, CommodityKey, Player} from '../types';

@Component({
  selector: '[playerCommodity]',
  templateUrl: './player-commodity.component.html'
})
export class PlayerCommodityComponent {
  @Input() id: CommodityKey;
  @Input() player: Player;
  @Input() clicks: EventEmitter<Click>;
  @Input() value: number;

  plus(id: CommodityKey, player: Player): void {
    this.clicks.next({ id, playerNum: player, plus: true });
  }

  minus(id: CommodityKey, player: Player): void {
    this.clicks.next({ id, playerNum: player, plus: false });
  }

  render(quantity: number): string {
    if (Math.floor(quantity) == quantity) return quantity.toString();
    let intPart = "";
    if (Math.floor(quantity) > 0) intPart = intPart + Math.floor(quantity);
    let fracPart = quantity - Math.floor(quantity);
    let fracStr = "";
    if (fracPart === 0.25) {
      fracStr = '&frac14;';
    } else if (fracPart === 0.5) {
      fracStr = '&frac12;';
    } else {
      fracStr = '&frac34;';
    }
    return intPart + fracStr;
  }
}
