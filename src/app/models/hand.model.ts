import { computed, signal, untracked } from '@angular/core';
import { AceMaxValue, AceMinValue } from '../enums/ranks.enum';
import { Card } from './card.model';
import { env } from '../../environments/environment';

export const BustValue = 21;
export const DealerMustHitValue = 17;

export class Hand {
  public readonly cards = signal<Card[]>([]);
  public readonly name = signal<string>('Player');
  public readonly chips = signal<number>(0);
  public readonly isBusted = computed(() => this.value() > BustValue);
  public readonly isBlackjack = computed(
    () => this.cards().length === 2 && this.value() === BustValue
  );
  public readonly chipsScore = computed(() => {
    return this.chips() * env.chipValue;
  });
  public readonly value = computed(() => {
    let totalValue = this.hardValue();

    untracked(() => {
      let aceCount = this.aceCards().length;
      while (totalValue > BustValue && aceCount-- > 0) {
        totalValue -= AceMaxValue - AceMinValue;
      }
    });

    return totalValue;
  });
  public isWinner: boolean = false;

  private readonly aceCards = computed(() =>
    this.cards().filter((card) => card.isAce())
  );
  private readonly valueWithoutAce = computed(() =>
    this.cards()
      .filter((card) => !card.isAce())
      .reduce((acc, card) => acc + card.getValue(), 0)
  );
  private readonly hardValue = computed(() =>
    this.aceCards().reduce(
      (accResponse, card) => accResponse + card.getValue(),
      this.valueWithoutAce()
    )
  );

  public constructor(name: string, initialChips = env.initialChips) {
    this.name.set(name);
    this.chips.set(initialChips);
  }

  public turnAllCardsFaceUp(): void {
    this.cards.update((cards) => {
      return cards.map((card) => {
        card.isFaceDown = false;
        return card;
      });
    });
  }

  public addCard(card: Card): void {
    this.cards.update((cards) => {
      const newCards = [...cards, card];
      return newCards;
    });
  }

  public wins(chips = env.defaultBetSize): void {
    this.isWinner = true;
    this.chips.update((ch) => ch + chips);
  }

  public loses(chips = env.defaultBetSize): void {
    this.isWinner = false;
    this.chips.update((ch) => ch - chips);
  }
}
