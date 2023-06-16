import { HandInt } from '@/lib/interfaces';
import CardComponent from './Card';

type Props = {
    hand: HandInt;
};

export default function HandComponent({ hand }: Props) {
    return (
        // map cards
        <div>
            {hand.cards.map((card, index) => {
                return <CardComponent key={index} value={card.value} suit={card.suit} />;
            })}
        </div>
    );
}
