import { computed, signal, untracked } from '@angular/core';
import { AceMaxValue, AceMinValue } from '../enums/ranks.enum';
import { Card } from './card.model';

export const BustValue = 21;
export const DealerMustHitValue = 17;

export class Hand {
  public readonly cards = signal<Card[]>([]);
  public readonly name = signal<string>('Player');
  public readonly isBusted = computed(() => this.value() > BustValue);
  public readonly isBlackjack = computed(
    () => this.cards().length === 2 && this.value() === BustValue
  );
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

  public constructor(name: string) {
    this.name.set(name);
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

  public wins(): void {
    this.isWinner = true;
  }
}
