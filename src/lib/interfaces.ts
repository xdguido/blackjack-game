export interface CardInt {
    value: number | string;
    suit: string;
}

export interface HandInt {
    cards: CardInt[];
    sumPoints(): number;
}

export interface ShoeInt {
    decks: CardInt[];
    popCardFromShoe(): { card: CardInt | undefined; newShoe: ShoeInt };
}
