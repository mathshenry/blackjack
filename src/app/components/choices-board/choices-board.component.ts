import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  HostBinding,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { fadeInAnimation } from '../../animations/fade-in.animation';

@Component({
  selector: 'app-choices-board',
  templateUrl: './choices-board.component.html',
  styleUrl: './choices-board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation],
})
export class ChoicesBoardComponent {
  public readonly message = input<string | null>(null);
  public readonly showActions = input<boolean>(false);
  public readonly isPlayerTurn = input<boolean>(false);
  public readonly isGameOver = input<boolean>(false);
  public readonly playerWins = input<boolean>(false);
  public readonly dealerWins = input<boolean>(false);
  public readonly hit = output<void>();
  public readonly stand = output<void>();
  public readonly restart = output<void>();

  @HostBinding('class.player-won')
  protected playerWon = false;

  @HostBinding('class.player-lost')
  protected playerLost = false;

  protected isStartText = signal<boolean>(true);

  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    this.watchForPlayerWins();
    this.watchForPlayerLoses();
  }

  watchForPlayerWins() {
    effect(() => {
      this.playerWon = this.playerWins();
    });
  }

  watchForPlayerLoses() {
    effect(() => {
      this.playerLost = this.dealerWins();
    });
  }
}
