import { Card } from './card.model';
import { Suits } from '../enums/suits.enum';
import { Ranks, AceMaxValue } from '../enums/ranks.enum';

describe('Card', () => {
  let card: Card;

  beforeEach(() => {
    card = new Card();
  });

  it('should create a card instance', () => {
    expect(card).toBeTruthy();
  });

  it('should return the correct image path', () => {
    card.suit = Suits.Hearts;
    card.rank = Ranks.Ten;

    const imagePath = card.getImage();
    expect(imagePath).toBe('/assets/images/cards/10H.svg');
  });

  it('should return the correct name of the card', () => {
    card.suit = Suits.Spades;
    card.rank = Ranks.Queen;

    const cardName = card.getName();
    expect(cardName).toBe('Q of Spades');
  });

  it('should return the correct value for number cards', () => {
    card.suit = Suits.Clubs;
    card.rank = Ranks.Seven;

    const cardValue = card.getValue();
    expect(cardValue).toBe(7);
  });

  it('should return the correct value for face cards (J, Q, K)', () => {
    card.suit = Suits.Diamonds;
    card.rank = Ranks.King;

    const cardValue = card.getValue();
    expect(cardValue).toBe(10);
  });

  it('should return the correct value for an Ace with default AceMaxValue', () => {
    card.suit = Suits.Hearts;
    card.rank = Ranks.Ace;

    const cardValue = card.getValue();
    expect(cardValue).toBe(AceMaxValue);
  });

  it('should return the correct value for an Ace with a custom ace value', () => {
    card.suit = Suits.Spades;
    card.rank = Ranks.Ace;

    const cardValue = card.getValue(1);
    expect(cardValue).toBe(1);
  });

  it('should correctly identify if the card is an Ace', () => {
    card.suit = Suits.Clubs;
    card.rank = Ranks.Ace;

    expect(card.isAce()).toBeTrue();
  });

  it('should correctly identify if the card is not an Ace', () => {
    card.suit = Suits.Diamonds;
    card.rank = Ranks.Two;

    expect(card.isAce()).toBeFalse();
  });

  it('should default isFaceDown to false', () => {
    expect(card.isFaceDown).toBeFalse();
  });
});
