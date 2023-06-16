import { Hand } from '@/pages';
import CardComponent from './Card';

type Props = {
    hand: Hand;
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
