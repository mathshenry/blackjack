import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { env } from '../../../environments/environment';
import { messages } from '../../messages';
import { GameService } from '../../services/game.service';
import { ChoicesBoardComponent } from '../choices-board/choices-board.component';
import { HandComponent } from '../hand/hand.component';

@Component({
  selector: 'app-board',
  imports: [HandComponent, ChoicesBoardComponent, ChoicesBoardComponent],
  providers: [GameService],
  templateUrl: `./board.component.html`,
  standalone: true,
  styleUrl: './board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent {
  protected readonly gameService = inject(GameService);
  protected readonly handDelay = env.gameDefaultDelay;
  protected readonly messages = messages;
}
