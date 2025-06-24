import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

import { env } from '../../environments/environment';

const defaultDelay = env.gameDefaultDelay;

export const chipInAnimation = trigger('cardIn', [
  state('void', style({ bottom: '100dvh' })),
  transition(
    ':enter',
    [animate(`${defaultDelay}ms ease-in-out`, style({ bottom: '*' }))],
    { params: { delay: 0 } }
  ),
  transition(
    ':leave',
    [animate(`500ms {{delayOut}}ms ease-in-out`, style({ bottom: '100dvh' }))],
    { params: { delayOut: 0 } }
  ),
]);
