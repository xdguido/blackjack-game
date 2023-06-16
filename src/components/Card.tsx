import { CardInt } from '@/lib/interfaces';
type Props = {
    card: CardInt;
    isCovered?: boolean;
};
export default function CardComponent({ card, isCovered = false }: Props) {
    return (
        <div className="flex gap-2">
            {isCovered ? (
                <span>covered cart</span>
            ) : (
                <>
                    <span>{card.value}</span>
                    <span>{card.suit}</span>
                </>
            )}
        </div>
    );
}
