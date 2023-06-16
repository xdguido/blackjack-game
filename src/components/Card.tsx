import { CardInt } from '@/lib/interfaces';

export default function CardComponent({ value, suit }: CardInt) {
    return (
        <div className="flex gap-2">
            <span>{value}</span>
            <span>{suit}</span>
        </div>
    );
}
