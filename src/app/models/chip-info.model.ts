import { computed, signal } from '@angular/core';

export class ChipInfo {
  public isBet = signal(false);

  constructor(isBet = false) {
    this.isBet.set(isBet);
  }
}
