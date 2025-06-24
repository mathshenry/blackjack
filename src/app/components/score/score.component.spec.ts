import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ScoreComponent } from './score.component';
import { ChipInfo } from '../../models/chip-info.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ScoreComponent', () => {
  let component: ScoreComponent;
  let fixture: ComponentFixture<ScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ScoreComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct score', () => {
    fixture.componentRef.setInput('score', 100);
    fixture.detectChanges();

    const scoreElement = fixture.debugElement.query(
      By.css('.score')
    ).nativeElement;
    expect(scoreElement.textContent).toContain('100');
  });

  it('should initialize chipsList based on chips input', () => {
    const chipsSize = 5;
    fixture.componentRef.setInput('chips', chipsSize);
    fixture.detectChanges();

    expect((component as any).chipsList().length).toBe(chipsSize);
    expect(
      (component as any)
        .chipsList()
        .every((chip: ChipInfo) => chip instanceof ChipInfo)
    ).toBeTrue();
  });

  it('should update chipsList when chips input changes', () => {
    fixture.componentRef.setInput('chips', 3);
    fixture.detectChanges();
    expect((component as any).chipsList().length).toBe(3);

    fixture.componentRef.setInput('chips', 6);
    fixture.detectChanges();
    expect((component as any).chipsList().length).toBe(6);

    fixture.componentRef.setInput('chips', 2);
    fixture.detectChanges();
    expect((component as any).chipsList().length).toBe(2);
  });

  it('should mark chips as bet based on chipsInBet input', () => {
    const betSize = 2;
    fixture.componentRef.setInput('chips', 5);
    fixture.componentRef.setInput('chipsInBet', betSize);
    fixture.detectChanges();

    const betChips = (component as any)
      .chipsList()
      .filter((chip: ChipInfo) => chip.isBet());
    expect(betChips.length).toBe(betSize * 2); // Dealer's chips are also there
  });

  it('should render the correct number of chip elements', () => {
    fixture.componentRef.setInput('chips', 4);
    fixture.detectChanges();

    const chipElements = fixture.debugElement.queryAll(By.css('.chip'));
    expect(chipElements.length).toBe(4);
  });

  it('should apply the "bet" class to chips marked as bet', () => {
    const betSize = 2;
    fixture.componentRef.setInput('chips', 5);
    fixture.componentRef.setInput('chipsInBet', betSize);
    fixture.detectChanges();

    const chipElements = fixture.debugElement.queryAll(By.css('.chip.bet'));
    expect(chipElements.length).toBe(betSize * 2); // it has the chips of the dealer too
  });

  it('should not apply the "bet" class to chips not marked as bet', () => {
    const betSize = 2;
    fixture.componentRef.setInput('chips', 5);
    fixture.componentRef.setInput('chipsInBet', betSize);
    fixture.detectChanges();

    const nonBetChipElements = fixture.debugElement.queryAll(
      By.css('.chip:not(.bet)')
    );
    expect(nonBetChipElements.length).toBe(3);
  });

  it('should handle empty chipsList gracefully', () => {
    fixture.componentRef.setInput('chips', 0);
    fixture.detectChanges();

    const chipElements = fixture.debugElement.queryAll(By.css('.chip'));
    expect(chipElements.length).toBe(0);
  });
});
