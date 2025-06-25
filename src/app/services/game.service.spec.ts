import { TestBed } from '@angular/core/testing';
import { GameService, PlayerName, DealerName } from './game.service';
import { Deck } from '../models/deck.model';
import { Hand } from '../models/hand.model';
import { env } from '../../environments/environment';
import { messages } from '../messages';
import { Card } from '../models/card.model';

describe('GameService', () => {
  let service: GameService;
  let playerHandMock: jasmine.SpyObj<Hand>;
  let dealerHandMock: jasmine.SpyObj<Hand>;
  let deckMock: jasmine.SpyObj<Deck>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameService],
    });
    service = TestBed.inject(GameService);

    // Create two separate spy objects for player and dealer hands
    playerHandMock = jasmine.createSpyObj('Hand', [
      'addCard',
      'chips',
      'isBusted',
      'isBlackjack',
      'value',
      'turnAllCardsFaceUp',
      'wins',
      'loses',
    ]);
    dealerHandMock = jasmine.createSpyObj('Hand', [
      'addCard',
      'chips',
      'isBusted',
      'isBlackjack',
      'value',
      'turnAllCardsFaceUp',
      'wins',
      'loses',
    ]);

    // Default return values and .set for chips
    playerHandMock.chips.and.returnValue(env.initialChips);
    playerHandMock.isBusted.and.returnValue(false);
    playerHandMock.isBlackjack.and.returnValue(false);
    playerHandMock.value.and.returnValue(10);
    (playerHandMock.chips as any).set = jasmine.createSpy('set');

    dealerHandMock.chips.and.returnValue(env.initialChips);
    dealerHandMock.isBusted.and.returnValue(false);
    dealerHandMock.isBlackjack.and.returnValue(false);
    dealerHandMock.value.and.returnValue(10);
    (dealerHandMock.chips as any).set = jasmine.createSpy('set');

    // Mock Deck
    deckMock = jasmine.createSpyObj('Deck', ['dealCard']);
    deckMock.dealCard.and.returnValue(new Card());

    // Mock signals as functions with .set and .asReadonly
    (service as any).playerHand = (() => playerHandMock) as any;
    (service as any).playerHand.set = jasmine.createSpy('set');
    (service as any).playerHand.asReadonly = () => () => playerHandMock;

    (service as any).dealerHand = (() => dealerHandMock) as any;
    (service as any).dealerHand.set = jasmine.createSpy('set');
    (service as any).dealerHand.asReadonly = () => () => dealerHandMock;

    (service as any).deck = (() => deckMock) as any;
    (service as any).deck.set = jasmine.createSpy('set');

    // Also mock the readonly signals
    (service as any).playerHand$ = () => playerHandMock;
    (service as any).dealerHand$ = () => dealerHandMock;
    (service as any).deck$ = () => deckMock;

    (service as any).isGameOver = jasmine
      .createSpy('isGameOver')
      .and.returnValue(false);
    (service as any).playerTurn = jasmine
      .createSpy('playerTurn')
      .and.returnValue(true);

    // For signals with .set
    (service as any).playerTurn.set = jasmine.createSpy('set');
    (service as any).isGameOver.set = jasmine.createSpy('set');
    (service as any).isProcessing.set = jasmine.createSpy('set');
    (service as any).chipsInBet.set = jasmine.createSpy('set');
    (service as any).message.set = jasmine.createSpy('set');
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should reset the score', () => {
    service.resetScore();
    expect(playerHandMock.chips.set).toHaveBeenCalledWith(env.initialChips);
    expect((service as any).message.set).toHaveBeenCalledWith(messages.welcome);
  });

  it('should set bet if player has enough chips', () => {
    playerHandMock.chips.and.returnValue(env.defaultBetSize + 1);
    expect((service as any).setBet()).toBeTrue();
    expect((service as any).chipsInBet.set).toHaveBeenCalledWith(
      env.defaultBetSize
    );
  });

  it('should not set bet if player is out of money', () => {
    playerHandMock.chips.and.returnValue(env.defaultBetSize - 1);
    expect((service as any).setBet()).toBeFalse();
    expect((service as any).chipsInBet.set).not.toHaveBeenCalledWith(
      env.defaultBetSize
    );
  });

  it('should set outOfMoney$ to true if player has less than default bet', () => {
    playerHandMock.chips.and.returnValue(env.defaultBetSize - 1);
    expect(service.outOfMoney$()).toBeTrue();
  });

  it('should set outOfMoney$ to false if player has enough chips', () => {
    playerHandMock.chips.and.returnValue(env.defaultBetSize);
    expect(service.outOfMoney$()).toBeFalse();
  });

  it('should set message to restart if game is over on playerHits', () => {
    (service as any).isGameOver.and.returnValue(true);
    service.playerHits();
    expect((service as any).message.set).toHaveBeenCalledWith(messages.restart);
  });

  it('should set message to dealerTurn if not player turn on playerHits', () => {
    (service as any).isGameOver.and.returnValue(false);
    (service as any).playerTurn.and.returnValue(false);
    service.playerHits();
    expect((service as any).message.set).toHaveBeenCalledWith(
      messages.dealerTurn
    );
  });

  it('should call addCard on playerHand when playerHits', () => {
    (service as any).isGameOver.and.returnValue(false);
    (service as any).playerTurn.and.returnValue(true);
    playerHandMock.isBusted.and.returnValue(false);
    service.playerHits();
    expect(playerHandMock.addCard).toHaveBeenCalled();
  });

  it('should handle player bust on playerHits', () => {
    (service as any).isGameOver.and.returnValue(false);
    (service as any).playerTurn.and.returnValue(true);
    playerHandMock.isBusted.and.returnValue(true);
    spyOn(service as any, 'gameOver');
    spyOn(service as any, 'dealerWins');
    service.playerHits();
    expect((service as any).gameOver).toHaveBeenCalledWith(
      messages.playerBusted
    );
    expect((service as any).dealerWins).toHaveBeenCalled();
  });

  it('should call turnAllCardsFaceUp on dealerHand and set message on playerStands', async () => {
    (service as any).isGameOver.and.returnValue(true);
    dealerHandMock.turnAllCardsFaceUp.and.stub();
    await service.playerStands();
    expect(dealerHandMock.turnAllCardsFaceUp).toHaveBeenCalled();
    expect((service as any).message.set).toHaveBeenCalledWith(
      messages.dealerRevealed
    );
  });

  it('should call dealerPlays and checkWinner if game is not over after playerStands', async () => {
    (service as any).isGameOver.and.returnValue(false);
    spyOn(service as any, 'dealerPlays').and.returnValue(Promise.resolve());
    spyOn(service as any, 'checkWinner');
    dealerHandMock.turnAllCardsFaceUp.and.stub();
    await service.playerStands();
    expect((service as any).dealerPlays).toHaveBeenCalled();
    expect((service as any).checkWinner).toHaveBeenCalled();
  });

  it('should call playerWins and gameOver with playerBlackjack if player has blackjack', () => {
    playerHandMock.isBlackjack.and.returnValue(true);
    dealerHandMock.isBlackjack.and.returnValue(false);
    spyOn(service as any, 'playerWins');
    spyOn(service as any, 'gameOver');
    (service as any).checkBlackjack();
    expect((service as any).playerWins).toHaveBeenCalled();
    expect((service as any).gameOver).toHaveBeenCalledWith(
      messages.playerBlackjack
    );
  });

  it('should call dealerWins and gameOver with dealerBlackjack if dealer has blackjack', () => {
    playerHandMock.isBlackjack.and.returnValue(false);
    dealerHandMock.isBlackjack.and.returnValue(true);
    spyOn(service as any, 'dealerWins');
    spyOn(service as any, 'gameOver');
    (service as any).checkBlackjack();
    expect((service as any).dealerWins).toHaveBeenCalled();
    expect((service as any).gameOver).toHaveBeenCalledWith(
      messages.dealerBlackjack
    );
  });

  it('should call gameOver with bothBlackjack if both have blackjack', () => {
    playerHandMock.isBlackjack.and.returnValue(true);
    dealerHandMock.isBlackjack.and.returnValue(true);
    spyOn(service as any, 'gameOver');
    (service as any).checkBlackjack();
    expect((service as any).gameOver).toHaveBeenCalledWith(
      messages.bothBlackjack
    );
  });

  it('should call playerWins and set message to dealerBusted if dealer busts', () => {
    playerHandMock.value.and.returnValue(18);
    dealerHandMock.value.and.returnValue(22);
    spyOn(service as any, 'playerWins');
    (service as any).checkWinner();
    expect((service as any).playerWins).toHaveBeenCalled();
    expect((service as any).message.set).toHaveBeenCalledWith(
      messages.dealerBusted
    );
  });

  it('should call playerWins and set message to playerWins if player beats dealer', () => {
    playerHandMock.value.and.returnValue(20);
    dealerHandMock.value.and.returnValue(18);
    spyOn(service as any, 'playerWins');
    (service as any).checkWinner();
    expect((service as any).playerWins).toHaveBeenCalled();
    expect((service as any).message.set).toHaveBeenCalledWith(
      messages.playerWins
    );
  });

  it('should call dealerWins and set message to dealerWins if dealer beats player', () => {
    playerHandMock.value.and.returnValue(18);
    dealerHandMock.value.and.returnValue(20);
    spyOn(service as any, 'dealerWins');
    (service as any).checkWinner();
    expect((service as any).dealerWins).toHaveBeenCalled();
    expect((service as any).message.set).toHaveBeenCalledWith(
      messages.dealerWins
    );
  });

  it('should set message to push if player and dealer tie', () => {
    playerHandMock.value.and.returnValue(19);
    dealerHandMock.value.and.returnValue(19);
    (service as any).checkWinner();
    expect((service as any).message.set).toHaveBeenCalledWith(messages.push);
  });

  it('should set chips and call wins/loses on playerWins and dealerWins', () => {
    (service as any).playerWins();
    expect(playerHandMock.wins).toHaveBeenCalled();
    expect((service as any).chipsInBet.set).toHaveBeenCalledWith(0);
    (service as any).dealerWins();
    expect(dealerHandMock.wins).toHaveBeenCalled();
    expect(playerHandMock.loses).toHaveBeenCalled();
    expect((service as any).chipsInBet.set).toHaveBeenCalledWith(0);
  });

  it('should reset the game with or without keeping score', () => {
    playerHandMock.chips.and.returnValue(42);
    (service as any).resetGame(true);
    expect((service as any).playerHand.set).toHaveBeenCalledWith(
      jasmine.any(Hand)
    );
    (service as any).resetGame(false);
    expect((service as any).playerHand.set).toHaveBeenCalledWith(
      jasmine.any(Hand)
    );
    expect((service as any).isGameOver.set).toHaveBeenCalledWith(false);
    expect((service as any).playerTurn.set).toHaveBeenCalledWith(true);
  });

  it('should set message to noMoreCards if deck is empty on dealCard', () => {
    deckMock.dealCard.and.returnValue(null);
    (service as any).dealCard((service as any).playerHand);
    expect((service as any).message.set).toHaveBeenCalledWith(
      messages.noMoreCards
    );
  });
});
