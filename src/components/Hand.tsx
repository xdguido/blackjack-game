import { HandInt } from '@/lib/interfaces';
import CardComponent from './Card';

type Props = {
    hand: HandInt;
    coverCard?: boolean;
};
export default function HandComponent({ hand, coverCard = false }: Props) {
    return (
        // map cards
        <div className="relative h-32 w-36 flex items-center">
            {hand.cards.map((card, index) => {
                const dynamicLeft = `${index * 50}px`;
                return (
                    <div key={index} style={{ left: dynamicLeft }} className="absolute">
                        <CardComponent
                            card={card}
                            isCovered={index === 1 && coverCard ? true : false}
                        />
                    </div>
                );
            })}
        </div>
    );
}
