import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

import { env } from '../../environments/environment';

const defaultDelay = env.gameDefaultDelay;

export const fadeInAnimation = trigger('fadeIn', [
    state('void', style({ opacity: '0', height: '0' })),
    transition(':enter', [
      animate(`${defaultDelay}ms ease-in-out`, style({ opacity: 1, height: '*' })),
    ]),
]);