# Blackjack

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## 🃏 Blackjack - Game Rules and How to Play

### 🎯 Objective

The goal of Blackjack is to beat the dealer by having a hand value as close to **21** as possible **without going over**. You win by:

- Having a higher hand value than the dealer.
- The dealer going over 21 ("busting").
- Getting a "Blackjack" (an Ace and a 10-point card) on the first two cards.

---

### 🧩 Card Values

| Card    | Value                                             |
| ------- | ------------------------------------------------- |
| 2–10    | Face value                                        |
| J, Q, K | 10 points                                         |
| Ace (A) | 1 or 11 points (whichever benefits the hand more) |

---

### 🎮 Game Flow

1. **Start the Game**

   - The player and dealer are each dealt **two cards**.
   - The player's cards are both visible.
   - The dealer has **one card face-up**, one face-down.

2. **Player Turn**

   - The player can choose to:

     - `Hit` – draw another card.
     - `Stand` – end their turn.

   - The player can continue hitting until they:

     - Stand, or
     - Bust (hand goes over 21 – automatic loss).

3. **Dealer Turn**

   - Once the player stands or busts:

     - The dealer reveals their hidden card.
     - The dealer **must hit** until their hand value is **17 or higher**.
     - The dealer **must stand** on **17 or more** (including "soft 17", depending on house rules – your version can clarify this).

4. **Determine the Outcome**

   - If the player busts → **Dealer wins**.
   - If the dealer busts → **Player wins**.
   - If neither busts → Compare hand values:

     - Higher value wins.
     - Tie results in a **push** (no one wins).

---

### 🏆 Blackjack

- If the player's **first two cards** total **21** (Ace + 10-point card), it is a **Blackjack**.
- Blackjack usually beats a 21 achieved through additional cards.
- Optionally, you can implement a **3:2 payout** for Blackjack.

---

### ✋ Optional Rules (Advanced Features)

You may optionally implement these features in future versions:

- **Double Down** – Double the bet, draw one final card, then stand.
- **Split** – If the first two cards are the same, split into two separate hands.
- **Insurance** – If dealer's upcard is an Ace, player can bet on the dealer having Blackjack.
- **Surrender** – Player forfeits half their bet to fold their hand early.

---

### Content Sources

**Cards SVGs taken from https://www.me.uk/cards/makeadeck.cgi?view**
