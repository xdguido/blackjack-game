import { useState } from 'react';
import { useTimeoutFn } from 'react-use';
import { CardInt } from '@/lib/interfaces';

type Props = {
    card: CardInt;
    isCovered?: boolean;
};
export default function CardComponent({ card, isCovered }: Props) {
    const [flip, setFlip] = useState(isCovered);
    useTimeoutFn(() => {
        setFlip(true);
    }, 10);
    const setColor = (suit: string) => {
        switch (suit) {
            case 'Clubs':
            case 'Spades':
                return 'text-black';

            case 'Diamonds':
            case 'Hearts':
                return 'text-red-500';
        }
    };
    const setSuit = (suit: string) => {
        switch (suit) {
            case 'Clubs':
                return '♣️';
            case 'Spades':
                return '♠️';
            case 'Hearts':
                return '♥️';
            case 'Diamonds':
                return '♦️';
        }
    };
    const suit = setSuit(card.suit);
    const color = setColor(card.suit);
    return (
        <div className="relative w-24 h-24">
            <div className={`card ${isCovered ? '' : flip ? 'flip' : ''}`}>
                <div
                    className={`${color} front-face font-semibold p-1.5 text-3xl rounded-lg border border-gray-300`}
                >
                    <span className="">{card.value}</span>
                    <span className="">{suit}</span>
                </div>
                <div className="back-face rounded-lg"></div>
            </div>
        </div>
    );
}
