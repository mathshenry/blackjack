import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  HostBinding,
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
  public readonly outOfMoney = input<boolean>(false);
  public readonly hit = output<void>();
  public readonly stand = output<void>();
  public readonly restart = output<void>();
  public readonly reset = output<void>();

  @HostBinding('class.player-won')
  protected playerWon = false;

  @HostBinding('class.player-lost')
  protected playerLost = false;

  protected readonly isStartText = signal<boolean>(true);

  protected readonly buttonText = computed(() =>
    this.outOfMoney()
      ? 'RESET'
      : this.isStartText()
      ? 'Start Game'
      : 'Play Again'
  );

  constructor() {
    this.watchForPlayerWins();
    this.watchForPlayerLoses();
  }

  protected restartClick() {
    this.isStartText.set(false);
    const output = this.outOfMoney() ? this.reset : this.restart;
    output.emit();
  }

  private watchForPlayerWins() {
    effect(() => {
      this.playerWon = this.playerWins();
    });
  }

  private watchForPlayerLoses() {
    effect(() => {
      this.playerLost = this.dealerWins();
    });
  }
}
