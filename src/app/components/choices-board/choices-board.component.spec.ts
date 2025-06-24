import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ChoicesBoardComponent } from './choices-board.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ChoicesBoardComponent', () => {
  let component: ChoicesBoardComponent;
  let fixture: ComponentFixture<ChoicesBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoicesBoardComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ChoicesBoardComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display welcome message', () => {
    fixture.componentRef.setInput('message', 'welcome');
    fixture.detectChanges();

    const message = fixture.debugElement.query(By.css('.message'));
    expect(message.nativeElement.textContent).toBe('welcome');
  });

  it('should emit hit event when the button is clicked', () => {
    fixture.componentRef.setInput('isPlayerTurn', true);
    fixture.componentRef.setInput('isGameOver', false);
    fixture.componentRef.setInput('showActions', true);
    fixture.detectChanges();

    spyOn(component.hit, 'emit');

    const buttons = fixture.debugElement.queryAll(By.css('.button'));
    const hitButton = buttons.find(
      (button) => button.nativeElement.textContent.trim() === 'Hit'
    );

    hitButton?.triggerEventHandler('click', null);

    expect(component.hit.emit).toHaveBeenCalled();
  });

  it('should emit stand event when the button is clicked', () => {
    fixture.componentRef.setInput('isPlayerTurn', true);
    fixture.componentRef.setInput('isGameOver', false);
    fixture.componentRef.setInput('showActions', true);
    fixture.detectChanges();

    spyOn(component.stand, 'emit');

    const buttons = fixture.debugElement.queryAll(By.css('.button'));
    const standButton = buttons.find(
      (button) => button.nativeElement.textContent.trim() === 'Stand'
    );

    standButton?.triggerEventHandler('click', null);

    expect(component.stand.emit).toHaveBeenCalled();
  });
});
