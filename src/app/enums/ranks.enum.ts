export enum Ranks {
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5,
    Six = 6,
    Seven = 7,
    Eight = 8,
    Nine = 9,
    Ten = 10,
    Jack = "J",
    Queen = "Q",
    King = "K",
    Ace = 'A'
}

export type Rank = keyof typeof Ranks;
export const rankValues = Object.keys(Ranks)
    .filter((key) => isNaN(Number(key)))
    .map(key => Ranks[key as keyof typeof Ranks]);
export const AceMaxValue = 11;
export const AceMinValue = 1;
    
