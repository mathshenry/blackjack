import { Deck } from './deck.model';
import { Card } from './card.model';
import { suitsValues } from '../enums/suits.enum';
import { rankValues } from '../enums/ranks.enum';

describe('Deck', () => {
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck();
  });

  it('should create a deck instance', () => {
    expect(deck).toBeTruthy();
  });

  it('should initialize the deck with 52 cards', () => {
    const totalCards = suitsValues.length * rankValues.length;
    const dealtCards = [];

    for (let i = 0; i < totalCards; i++) {
      const card = deck.dealCard();
      expect(card).toBeTruthy();
      dealtCards.push(card);
    }

    // Ensure all cards are unique
    const uniqueCards = new Set(
      dealtCards.map((card) => `${card?.rank}-${card?.suit}`)
    );
    expect(uniqueCards.size).toBe(totalCards);

    // Deck should now be empty
    expect(deck.dealCard()).toBeNull();
  });

  it('should shuffle the deck', () => {
    const initialDeck = [...(deck as any).cards]; // Access private cards array
    deck.shuffle();
    const shuffledDeck = [...(deck as any).cards];

    // Ensure the deck is shuffled (not in the same order)
    expect(shuffledDeck).not.toEqual(initialDeck);

    // Ensure the shuffled deck still contains the same cards
    const initialSet = new Set(
      initialDeck.map((card) => `${card.rank}-${card.suit}`)
    );
    const shuffledSet = new Set(
      shuffledDeck.map((card) => `${card.rank}-${card.suit}`)
    );
    expect(initialSet).toEqual(shuffledSet);
  });

  it('should deal a card from the top of the deck', () => {
    const initialDeckSize = suitsValues.length * rankValues.length;

    const dealtCard = deck.dealCard();
    expect(dealtCard).toBeTruthy();
    expect((deck as any).cards.length).toBe(initialDeckSize - 1);
  });

  it('should return null when dealing from an empty deck', () => {
    const totalCards = suitsValues.length * rankValues.length;

    // Deal all cards
    for (let i = 0; i < totalCards; i++) {
      deck.dealCard();
    }

    // Deck should now be empty
    expect(deck.dealCard()).toBeNull();
  });
});
