import { HandInt } from '@/lib/interfaces';
import CardComponent from './Card';

type Props = {
    hand: HandInt;
    coverCard?: boolean;
};
export default function HandComponent({ hand, coverCard = false }: Props) {
    return (
        // map cards
        <div>
            {hand.cards.map((card, index) => {
                return (
                    <CardComponent
                        key={index}
                        card={card}
                        isCovered={index === 1 && coverCard ? true : false}
                    />
                );
            })}
        </div>
    );
}
