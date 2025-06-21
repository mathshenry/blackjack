import { Injectable, signal, WritableSignal } from '@angular/core';
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

  public readonly playerHand$ = this.playerHand.asReadonly();
  public readonly dealerHand$ = this.dealerHand.asReadonly();
  public readonly isPlayerTurn$ = this.playerTurn.asReadonly();
  public readonly message$ = this.message.asReadonly();
  public readonly isGameOver$ = this.isGameOver.asReadonly();
  public readonly isProcessing$ = this.isProcessing.asReadonly();

  public async startGame(): Promise<void> {
    this.resetGame();
    await this.dealInitialCards();
    this.message.set(messages.playerTurn);
    this.checkBlackjack();
    this.isProcessing.set(false);
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
      this.dealerHand().wins();
      return;
    }
  }

  private checkBlackjack(): void {
    if (this.playerHand().isBlackjack() && this.dealerHand().isBlackjack()) {
      this.gameOver(messages.bothBlackjack);
      return;
    }

    if (this.playerHand().isBlackjack()) {
      this.playerHand().wins();
      this.gameOver(messages.playerBlackjack);
      return;
    }

    if (this.dealerHand().isBlackjack()) {
      this.dealerHand().wins();
      this.gameOver(messages.dealerBlackjack);
    }
  }

  private gameOver(message = messages.restart): void {
    this.isGameOver.set(true);
    this.playerTurn.set(false);
    this.message.set(message);
    this.dealerHand().turnAllCardsFaceUp();
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
      this.playerHand().wins();
      this.message.set(messages.dealerBusted);
      return;
    }

    if (playerValue > dealerValue) {
      this.playerHand().wins();
      this.message.set(messages.playerWins);
      return;
    }

    if (dealerValue > playerValue) {
      this.message.set(messages.dealerWins);
      this.dealerHand().wins();
      return;
    }

    this.message.set(messages.push);
  }

  private resetGame(): void {
    this.playerHand.set(new Hand(PlayerName));
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
