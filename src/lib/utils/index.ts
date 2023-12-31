import { CardInt } from '../interfaces';

export const sumPoints = (points: number, card: CardInt) => {
    let sum = points;
    let hasAce = false;
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
    if (hasAce && sum + 10 <= 21) {
        sum += 10;
    }
    return sum;
};

export const isBust = (points: number) => {
    if (points > 21) {
        return true;
    }
    return false;
};

export const isBlackjack = (points: number) => {
    if (points === 21) {
        return true;
    }
    return false;
};
