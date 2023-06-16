import { Card } from '@/pages';

export default function CardComponent({ value, suit }: Card) {
    return (
        <div className="flex gap-2">
            <span>{value}</span>
            <span>{suit}</span>
        </div>
    );
}
