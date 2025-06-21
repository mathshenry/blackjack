export enum Suits {
    Hearts = 'Hearts',
    Diamonds = 'Diamonds',
    Clubs = 'Clubs',
    Spades = 'Spades'
}

export type Suit = keyof typeof Suits;
export const suitsValues = Object.keys(Suits)
    .filter((key) => isNaN(Number(key)))
    .map(key => Suits[key as keyof typeof Suits]);
