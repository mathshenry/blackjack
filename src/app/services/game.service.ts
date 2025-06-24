import {
  computed,
  effect,
  Injectable,
  signal,
  untracked,
  WritableSignal,
} from '@angular/core';
import { env } from '../../environments/environment';
import { messages } from '../messages';
import { Deck } from '../models/deck.model';
import { BustValue, DealerMustHitValue, Hand } from '../models/hand.model';

export const PlayerName = 'Player';
export const DealerName = 'Dealer';

@Injectable()
export class GameService {
  private deck = signal<Deck>(new Deck());
  private playerHand = signal<Hand>(new Hand(PlayerName));
  private dealerHand = signal<Hand>(new Hand(DealerName));
  private playerTurn = signal<boolean>(true);
  private readonly message = signal<string>(messages.welcome);
  private readonly isProcessing = signal<boolean>(false);
  private readonly isGameOver = signal<boolean>(true);
  private readonly chipsInBet = signal<number>(0);

  public readonly playerHand$ = this.playerHand.asReadonly();
  public readonly dealerHand$ = this.dealerHand.asReadonly();
  public readonly isPlayerTurn$ = this.playerTurn.asReadonly();
  public readonly message$ = this.message.asReadonly();
  public readonly isGameOver$ = this.isGameOver.asReadonly();
  public readonly isProcessing$ = this.isProcessing.asReadonly();
  public readonly chipsInBet$ = this.chipsInBet.asReadonly();
  public readonly outOfMoney$ = computed(
    () => this.playerHand$().chips() < env.defaultBetSize
  );

  constructor() {
    this.watchOutOfMoney();
  }

  public async startGame(): Promise<void> {
    if (this.setBet()) {
      this.resetGame();
      await this.dealInitialCards();
      this.message.set(messages.playerTurn);
      this.checkBlackjack();
      this.isProcessing.set(false);
    }
  }

  public resetScore(): void {
    this.playerHand$().chips.set(env.initialChips);
    this.message.set(messages.welcome);
  }

  public async playerStands(): Promise<void> {
    // Player stands, dealer's turn
    this.isProcessing.set(true);
    this.playerTurn.set(false);
    this.message.set(messages.playerStands);
    await this.wait(env.gameDefaultDelay * 2);

    // Reveal the dealer's first card
    this.dealerHand().turnAllCardsFaceUp();
    this.message.set(messages.dealerRevealed);
    await this.wait(env.gameDefaultDelay * 2);

    // Check if the game is over after the player stands
    if (!this.isGameOver()) {
      await this.dealerPlays();
      this.checkWinner();
    }
    this.isProcessing.set(false);
  }

  public playerHits(): void {
    if (this.isGameOver()) {
      this.message.set(messages.restart);
      return;
    }

    if (!this.playerTurn()) {
      this.message.set(messages.dealerTurn);
      return;
    }

    this.dealCard(this.playerHand);

    if (this.playerHand().isBusted()) {
      this.gameOver(messages.playerBusted);
      this.dealerWins();
      return;
    }
  }

  private watchOutOfMoney(): void {
    effect(() => {
      if (this.outOfMoney$()) {
        untracked(() => {
          this.message.set(messages.outOfMoney);
        });
      }
    });
  }

  private setBet(): boolean {
    if (!this.outOfMoney$()) {
      this.chipsInBet.set(env.defaultBetSize);
    }

    return !this.outOfMoney$();
  }

  private checkBlackjack(): void {
    if (this.playerHand().isBlackjack() && this.dealerHand().isBlackjack()) {
      this.gameOver(messages.bothBlackjack);
      return;
    }

    if (this.playerHand().isBlackjack()) {
      this.playerWins();
      this.gameOver(messages.playerBlackjack);
      return;
    }

    if (this.dealerHand().isBlackjack()) {
      this.dealerWins();
      this.gameOver(messages.dealerBlackjack);
    }
  }

  private gameOver(message = messages.restart): void {
    this.isGameOver.set(true);
    this.playerTurn.set(false);
    this.message.set(message);
    this.dealerHand().turnAllCardsFaceUp();
    this.chipsInBet.set(0);
  }

  private async dealInitialCards(): Promise<void> {
    this.message.set(messages.initialDeal);
    this.isProcessing.set(true);
    const players = [
      { hand: this.playerHand, hideDeck: false },
      { hand: this.dealerHand, hideDeck: true },
    ];
    for (let i = 0; i++ < env.initialCardsCount; ) {
      players.forEach((player) => {
        this.dealCard(
          player.hand,
          player.hideDeck && i < env.initialCardsCount
        );
      });
    }

    await this.wait(env.gameDefaultDelay * env.initialCardsCount * 2);
  }

  private dealCard(hand: WritableSignal<Hand>, isHidden = false): void {
    const card = this.deck().dealCard();
    if (!card) {
      this.message.set(messages.noMoreCards);
      return;
    }

    card.isFaceDown = isHidden;
    hand().addCard(card);
  }

  private async dealerPlays(): Promise<void> {
    while (this.dealerHand().value() < DealerMustHitValue) {
      this.message.set(messages.dealerHits);
      this.dealCard(this.dealerHand);
      await this.wait(env.gameDefaultDelay * 2);
    }
    this.message.set(messages.dealerStands);
    await this.wait(env.gameDefaultDelay * 2);
  }

  private checkWinner(): void {
    const playerValue = this.playerHand().value();
    const dealerValue = this.dealerHand().value();

    if (dealerValue > BustValue) {
      this.playerWins();
      this.message.set(messages.dealerBusted);
      return;
    }

    if (playerValue > dealerValue) {
      this.playerWins();
      this.message.set(messages.playerWins);
      return;
    }

    if (dealerValue > playerValue) {
      this.message.set(messages.dealerWins);
      this.dealerWins();
      return;
    }

    this.message.set(messages.push);
  }

  private playerWins(): void {
    this.playerHand$().wins();
    this.chipsInBet.set(0);
  }

  private dealerWins(): void {
    this.dealerHand$().wins();
    this.playerHand$().loses();
    this.chipsInBet.set(0);
  }

  private resetGame(keepScore = true): void {
    this.playerHand.set(
      new Hand(PlayerName, keepScore ? this.playerHand().chips() : undefined)
    );
    this.dealerHand.set(new Hand(DealerName));
    this.deck.set(new Deck());
    this.message.set(messages.welcome);
    this.isGameOver.set(false);
    this.playerTurn.set(true);
  }

  private async wait(milliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }
}
