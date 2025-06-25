import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  signal,
  untracked,
} from '@angular/core';
import { ChipInfo } from '../../models/chip-info.model';
import { chipInAnimation } from '../../animations/chip-in.animation';
import { env } from '../../../environments/environment';

@Component({
  selector: 'app-score',
  imports: [],
  animations: [chipInAnimation],
  templateUrl: './score.component.html',
  styleUrl: './score.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreComponent {
  public score = input<number>(0);
  public chips = input<number>(0);
  public chipsInBet = input<number>(0);

  protected readonly chipsList = signal<ChipInfo[]>([]);
  protected readonly defaultDelay = env.gameDefaultDelay;

  constructor() {
    this.createBasicChips();
    this.watchBetSize();
  }

  private watchBetSize() {
    effect(() => {
      const betSize = this.chipsInBet();
      const chipsLength = this.chips();
      untracked(() => {
        this.chipsList().forEach((chip, index) => {
          if (index < chipsLength - betSize) {
            chip.isBet.set(false);
          } else {
            chip.isBet.set(true);
          }
        });
        for (let i = 0; i < betSize; i++) {
          this.chipsList().push(new ChipInfo(true));
        }
      });
    });
  }

  private createBasicChips() {
    effect(() => {
      const chips = this.chips();
      untracked(() => {
        const chipsListLength = this.chipsList().length;
        if (chips > chipsListLength) {
          for (let i = 0; i < chips - chipsListLength; i++) {
            this.chipsList().push(new ChipInfo());
          }

          return;
        }

        if (chips < chipsListLength) {
          for (let i = 0; i < chipsListLength - chips; i++) {
            this.chipsList().pop();
          }
        }
      });
    });
  }
}
