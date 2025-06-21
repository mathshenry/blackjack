import { AceMaxValue, Ranks } from '../enums/ranks.enum';
import { Suits } from '../enums/suits.enum';

export class Card {
  public suit!: Suits;
  public rank!: Ranks;
  public isFaceDown: boolean = false;

  public getImage(): string {
    return `/assets/images/cards/${this.rank}${this.suit[0].toUpperCase()}.svg`;
  }

  public getName(): string {
    return `${this.rank} of ${this.suit}`;
  }

  public getValue(aceValue?: number): number {
    if (typeof this.rank === 'number') {
      return this.rank;
    }

    if (this.rank === Ranks.Ace) {
      return aceValue || AceMaxValue;
    }

    return 10; // For J, Q, K
  }

  public isAce(): boolean {
    return this.rank === Ranks.Ace;
  }
}
