import {
    animate,
    state,
    style,
    transition,
    trigger
} from '@angular/animations';

import { env } from '../../environments/environment';

const defaultDelay = env.gameDefaultDelay;

export const cardInAnimation = trigger('cardIn', [
    state('void', style({ top: '-100dvh' })),
    transition(':enter', [
      animate(`${defaultDelay}ms {{delay}}ms ease-in-out`, style({ top: '0' })),
    ], { params: { delay: 0 } }),
]);