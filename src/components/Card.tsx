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
        <div className="relative w-20 h-24">
            <div className={`card ${isCovered ? '' : flip ? 'flip' : ''}`}>
                <div
                    className={`${color} flex items-start front-face font-semibold p-1.5 text-3xl leading-7 rounded-lg border border-slate-300`}
                >
                    <div className="flex flex-col items-center">
                        <span>{card.value}</span>
                        <span>{suit}</span>
                    </div>
                </div>
                <div className="back-face flex items-center justify-center text-3xl rounded-lg border border-slate-800">
                    ✨
                </div>
            </div>
        </div>
    );
}
