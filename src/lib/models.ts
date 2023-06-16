import { CardInt, HandInt, ShoeInt } from './interfaces';

export class Hand implements HandInt {
    cards: CardInt[];
    constructor() {
        this.cards = [];
    }
    sumPoints() {
        let sum = 0;
        let hasAce = false;
        for (const card of this.cards) {
            switch (card.value) {
                case 'A':
                    sum += 1;
                    hasAce = true;
                    break;
                case 'J':
                case 'Q':
                case 'K':
                    sum += 10;
                    break;
                default:
                    sum += card.value as number;
                    break;
            }
        }
        if (hasAce && sum + 10 <= 21) {
            sum += 10;
        }
        return sum;
    }
}

export class Shoe implements ShoeInt {
    decks: CardInt[];
    constructor(decks?: number) {
        this.decks = [];
        if (!decks) {
            return;
        }
        for (let i = 0; i < decks; i++) {
            const deck = this.createDeck();
            this.decks.push(...deck);
        }
        this.shuffle();
    }

    private createDeck(): CardInt[] {
        const suits = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
        const values = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
        const deck: CardInt[] = [];
        for (const suit of suits) {
            for (const value of values) {
                const card: CardInt = {
                    value: value,
                    suit: suit
                };
                deck.push(card);
            }
        }
        return deck;
    }

    private shuffle() {
        const { decks } = this;
        // Fisher-Yates shuffle algorithm
        for (let i = decks.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [decks[i], decks[j]] = [decks[j], decks[i]];
        }
    }

    // copy state and return updated objects for later save.
    popCardFromShoe() {
        const shoeCopy = new Shoe();
        shoeCopy.decks = this.decks;
        const card = shoeCopy.decks.pop();
        return { card, newShoe: shoeCopy };
    }
}
