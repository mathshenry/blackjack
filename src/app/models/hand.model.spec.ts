import { Hand } from './hand.model';
import { Card } from './card.model';
import { AceMaxValue, AceMinValue, Ranks } from '../enums/ranks.enum';
import { BustValue, DealerMustHitValue } from './hand.model';
import { env } from '../../environments/environment';
import { Suits } from '../enums/suits.enum';

function getCard1(rank = Ranks.Ten) {
  const card1 = new Card();
  card1.rank = rank;
  card1.suit = Suits.Hearts;
  return card1;
}

function getCard2(rank = Ranks.Nine) {
  const card2 = new Card();
  card2.rank = rank;
  card2.suit = Suits.Spades;
  return card2;
}

describe('Hand', () => {
  let hand: Hand;

  beforeEach(() => {
    hand = new Hand('Player', 100);
  });

  it('should create a hand instance with default values', () => {
    expect(hand).toBeTruthy();
    expect(hand.name()).toBe('Player');
    expect(hand.chips()).toBe(100);
    expect(hand.cards().length).toBe(0);
    expect(hand.isWinner).toBeFalse();
  });

  it('should calculate the correct value for a hand without aces', () => {
    const card1 = getCard1();
    const card2 = getCard2();

    hand.addCard(card1);
    hand.addCard(card2);

    expect(hand.value()).toBe(19);
    expect(hand.isBusted()).toBeFalse();
    expect(hand.isBlackjack()).toBeFalse();
  });

  it('should calculate the correct value for a hand with aces', () => {
    const card1 = getCard1(Ranks.Ace);
    const card2 = getCard2();

    hand.addCard(card1);
    hand.addCard(card2);

    expect(hand.value()).toBe(20);
    expect(hand.isBusted()).toBeFalse();
    expect(hand.isBlackjack()).toBeFalse();
  });

  it('should handle multiple aces correctly', () => {
    const card1 = getCard1(Ranks.Ace);
    const card2 = getCard2();

    const card3 = new Card();
    card3.rank = Ranks.Ace;
    card3.suit = Suits.Diamonds;

    hand.addCard(card1);
    hand.addCard(card2);
    hand.addCard(card3);

    expect(hand.value()).toBe(21); // One ace is treated as 1
    expect(hand.isBusted()).toBeFalse();
    expect(hand.isBlackjack()).toBeFalse();
  });

  it('should detect a blackjack', () => {
    const card1 = getCard1(Ranks.Ace);
    const card2 = getCard2(Ranks.Ten);

    hand.addCard(card1);
    hand.addCard(card2);

    expect(hand.isBlackjack()).toBeTrue();
  });

  it('should detect a busted hand', () => {
    const card1 = getCard1();
    const card2 = getCard2();

    const card3 = new Card();
    card3.rank = Ranks.Six;
    card3.suit = Suits.Diamonds;

    hand.addCard(card1);
    hand.addCard(card2);
    hand.addCard(card3);

    expect(hand.isBusted()).toBeTrue();
  });

  it('should turn all cards face up', () => {
    const card1 = getCard1();
    const card2 = getCard2();
    hand.addCard(card1);
    hand.addCard(card2);

    hand.turnAllCardsFaceUp();

    expect(hand.cards().every((card) => !card.isFaceDown)).toBeTrue();
  });

  it('should update chips correctly when winning', () => {
    hand.wins(50);
    expect(hand.chips()).toBe(150);
    expect(hand.isWinner).toBeTrue();
  });

  it('should update chips correctly when losing', () => {
    hand.loses(50);
    expect(hand.chips()).toBe(50);
    expect(hand.isWinner).toBeFalse();
  });

  it('should calculate chips score correctly', () => {
    expect(hand.chipsScore()).toBe(100 * env.chipValue);
  });
});
