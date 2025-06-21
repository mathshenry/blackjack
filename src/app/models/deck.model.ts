import { rankValues } from '../enums/ranks.enum';
import { suitsValues } from '../enums/suits.enum';
import { Card } from './card.model';

export class Deck {
  private cards!: Card[];

  constructor() {
    this.initializeDeck();
  }

  private initializeDeck(): void {
    this.cards = [];

    // Initialize the deck with all combinations of suits and ranks
    for (const suit of suitsValues) {
      for (const rank of rankValues) {
        const card = new Card();
        card.suit = suit;
        card.rank = rank;
        this.cards.push(card);
      }
    }

    this.shuffle();
  }

  public dealCard(): Card | null {
    return this.cards.pop() || null;
  }

  public shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
}
