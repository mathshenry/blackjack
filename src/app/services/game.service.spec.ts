// filepath: [game.service.spec.ts](http://_vscodecontentref_/4)
import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';
import { Deck } from '../models/deck.model';
import { Hand } from '../models/hand.model';
import { env } from '../../environments/environment';
import { messages } from '../messages';
import { Card } from '../models/card.model';

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameService],
    });
    service = TestBed.inject(GameService);

    // Mock the deck and hands
    spyOn(service as any, 'deck').and.returnValue({
      dealCard: jasmine.createSpy('dealCard').and.returnValue(new Card()),
    });
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should shuffle and reset the game', () => {
    spyOn(service as any, 'resetGame').and.callThrough();

    (service as any).resetGame();

    expect((service as any).deck).toBeTruthy();
    expect(service.message$()).toBe(messages.welcome);
    expect(service.isGameOver$()).toBeFalse();
    expect(service.isPlayerTurn$()).toBeTrue();
  });
});
