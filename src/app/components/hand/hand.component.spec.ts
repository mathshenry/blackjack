import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HandComponent } from './hand.component';
import { Card } from '../../models/card.model';
import { Suits } from '../../enums/suits.enum';
import { Ranks } from '../../enums/ranks.enum';
import { Hand } from '../../models/hand.model';

function getCards() {
  const card1 = new Card();
  card1.rank = Ranks.Ten;
  card1.suit = Suits.Hearts;
  const card2 = new Card();
  card2.rank = Ranks.Ace;
  card2.suit = Suits.Spades;
  return [card1, card2];
}

function getHand() {
  const hand = new Hand('Player');
  hand.cards.set(getCards());
  return hand;
}

describe('HandComponent', () => {
  let component: HandComponent;
  let fixture: ComponentFixture<HandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HandComponent,
        BrowserAnimationsModule, // Ensure animations are enabled
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HandComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct number of cards', () => {
    const hand = getHand();
    fixture.componentRef.setInput('hand', hand);
    fixture.detectChanges();

    const cardElements = fixture.debugElement.queryAll(By.css('.card'));
    expect(cardElements.length).toBe(hand.cards().length);
  });

  it('should apply the correct class for face-down cards', () => {
    const hand = getHand();
    hand.cards()[0].isFaceDown = true;
    fixture.componentRef.setInput('hand', hand);
    fixture.detectChanges();

    const faceDownCards = fixture.debugElement.queryAll(
      By.css('img[src="/assets/images/cards/back.svg"]')
    );
    expect(faceDownCards.length).toBe(1);
  });

  it('should calculate the correct hand value', () => {
    const hand = getHand();
    fixture.componentRef.setInput('hand', hand);
    fixture.detectChanges();

    const handValue = (component as any).hand().value();
    expect(handValue).toBe(21); // Assuming 'A' is treated as 11
  });

  it('should handle an empty hand gracefully', () => {
    fixture.componentRef.setInput('hand', new Hand('Player'));
    fixture.detectChanges();

    const cardElements = fixture.debugElement.queryAll(By.css('.card'));
    expect(cardElements.length).toBe(0);

    const handValue = (component as any).hand().value();
    expect(handValue).toBe(0);
  });
});
