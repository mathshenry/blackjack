import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { env } from '../../../environments/environment';
import { cardInAnimation } from '../../animations/card-in.animation';
import { Hand } from '../../models/hand.model';

@Component({
  selector: 'app-hand',
  imports: [],
  templateUrl: './hand.component.html',
  styleUrl: './hand.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [cardInAnimation],
})
export class HandComponent {
  public readonly hand = input<Hand | null>(null);
  public readonly handDelay = input<number>(0);

  protected getDelay(index: number): number {
    const delay =
      index < env.initialCardsCount
        ? this.handDelay() + index * (1.5 * env.gameDefaultDelay)
        : 0;
    return delay;
  }
}
