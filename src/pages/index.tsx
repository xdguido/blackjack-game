import { useState, useEffect } from 'react';
import HandComponent from '@/components/Hand';
// Define Card type
export type Card = {
    value: number | string;
    suit: string;
};

// Define Hand class
export class Hand {
    cards: Card[];
    constructor() {
        this.cards = [];
    }
    sumPoints() {
        let sum = 0;
        let hasAce = false;
        for (const card of this.cards) {
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
        }
        if (hasAce && sum + 10 <= 21) {
            sum += 10;
        }
        return sum;
    }
}

// Define Shoe class
class Shoe {
    decks: Card[];
    constructor(decks?: number) {
        this.decks = [];
        if (!decks) {
            return;
        }
        for (let i = 0; i < decks; i++) {
            const deck = this.createDeck();
            this.decks.push(...deck);
        }
        this.shuffle();
    }

    private createDeck(): Card[] {
        const suits = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
        const values = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
        const deck: Card[] = [];
        for (const suit of suits) {
            for (const value of values) {
                const card: Card = {
                    value: value,
                    suit: suit
                };
                deck.push(card);
            }
        }
        return deck;
    }

    private shuffle() {
        const { decks } = this;
        // Fisher-Yates shuffle algorithm
        for (let i = decks.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [decks[i], decks[j]] = [decks[j], decks[i]];
        }
    }

    // copy state and return updated objects for later save.
    popCardFromShoe() {
        const shoeCopy = new Shoe();
        shoeCopy.decks = this.decks;
        const card = shoeCopy.decks.pop();
        return { card, newShoe: shoeCopy };
    }
}

function sumPoints(points: number, card: Card) {
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
}

export default function Game() {
    // cards flow state
    const [playerHand, setPlayerHand] = useState<Hand>(() => new Hand());
    const [splitHand, setSplitHand] = useState<Hand>(() => new Hand());
    const [houseHand, setHouseHand] = useState<Hand>(() => new Hand());
    const [shoe, setShoe] = useState<Shoe>(() => new Shoe(2));
    // game flow state
    const [isDealing, setIsDealing] = useState(false);
    const [isGameOver, setIsGameOver] = useState(true);
    const [isFirstTurn, setIsFirstTurn] = useState(false);
    const [isLastTurn, setIsLastTurn] = useState(false);
    const [gameMessage, setGameMessage] = useState('');

    const playerPoints = playerHand.sumPoints();
    const splitPoints = splitHand.sumPoints();
    const housePoints = houseHand.sumPoints();

    const delay: number = 500;

    useEffect(() => {
        const evalBj = async () => {
            if (isFirstTurn) {
                const evaluateBlackjack = (points: number) => {
                    if (points === 21) {
                        return true;
                    }
                    return false;
                };
                const houseBj = evaluateBlackjack(housePoints);
                const playerBj = evaluateBlackjack(playerPoints);
                if (playerBj && !houseBj) {
                    setGameMessage('You won! Blackjack');
                    setIsLastTurn(false);
                    await resetHands();
                    setIsGameOver(true);
                }
                if (!playerBj && houseBj) {
                    setGameMessage('You lose to Blackjack');
                    setIsLastTurn(false);
                    await resetHands();
                    setIsGameOver(true);
                }
                if (playerBj && houseBj) {
                    setGameMessage('Push');
                    setIsLastTurn(false);
                    await resetHands();
                    setIsGameOver(true);
                }
            }
        };
        const evalBust = async () => {
            if (!isFirstTurn) {
                const evaluateBust = (points: number) => {
                    if (points > 21) {
                        return true;
                    }
                    return false;
                };
                const playerBust = evaluateBust(playerPoints);
                const houseBust = evaluateBust(housePoints);
                if (playerBust) {
                    setGameMessage('Bust');
                    setIsLastTurn(false);
                    await resetHands();
                    setIsGameOver(true);
                }
                if (houseBust) {
                    setGameMessage('You win. House bust');
                    setIsLastTurn(false);
                    await resetHands();
                    setIsGameOver(true);
                }
            }
        };
        const evalGame = async () => {
            const evaluateBust = (points: number) => {
                if (points > 21) {
                    return true;
                }
                return false;
            };
            const houseBust = evaluateBust(housePoints);
            if (isLastTurn && !houseBust) {
                if (playerPoints > housePoints) {
                    setGameMessage('You win');
                    setIsLastTurn(false);
                    await resetHands();
                    setIsGameOver(true);
                }
                if (playerPoints < housePoints) {
                    setGameMessage('You lose');
                    setIsLastTurn(false);
                    await resetHands();
                    setIsGameOver(true);
                }
                if (playerPoints === housePoints) {
                    setGameMessage('Push');
                    setIsLastTurn(false);
                    await resetHands();
                    setIsGameOver(true);
                }
            }
        };
        evalBj();
        evalBust();
        evalGame();
    }, [playerHand, playerPoints, housePoints, isGameOver, isFirstTurn, isLastTurn]);

    const resetHands = async () => {
        setIsDealing(true);
        await new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
        setIsDealing(false);
        setPlayerHand(new Hand());
        setHouseHand(new Hand());
        setSplitHand(new Hand());
    };

    const dealCards = async (hand: Hand, amount: number) => {
        let cardIndex: number = 0;

        const dealCard = () => {
            const { card, newShoe } = shoe.popCardFromShoe();

            switch (hand) {
                case playerHand:
                    setPlayerHand((prevState) => {
                        const updatedHand = new Hand();
                        updatedHand.cards = [...prevState.cards];
                        if (card) {
                            updatedHand.cards.push(card);
                        }
                        return updatedHand;
                    });
                    break;
                case houseHand:
                    setHouseHand((prevState) => {
                        const updatedHand = new Hand();
                        updatedHand.cards = [...prevState.cards];
                        if (card) {
                            updatedHand.cards.push(card);
                        }
                        return updatedHand;
                    });
                    break;
                case splitHand:
                    setSplitHand((prevState) => {
                        const updatedHand = new Hand();
                        updatedHand.cards = [...prevState.cards];
                        if (card) {
                            updatedHand.cards.push(card);
                        }
                        return updatedHand;
                    });
                    break;
                default:
                    console.log('Invalid hand');
            }

            setShoe(newShoe);
            cardIndex++;
        };

        while (cardIndex < amount) {
            await new Promise((resolve) => setTimeout(resolve, delay));
            dealCard();
        }
    };

    const handleStart = async () => {
        setIsGameOver(false);
        setGameMessage('');
        await dealInitialCards();
        setIsFirstTurn(true);
    };

    const handleHit = async () => {
        setIsDealing(true);
        await dealCards(playerHand, 1);
        setIsDealing(false);
        setIsFirstTurn(false);
    };

    const dealInitialCards = async () => {
        setIsDealing(true);
        await dealCards(houseHand, 2);
        await dealCards(playerHand, 2);
        setIsDealing(false);
    };

    const dealHouseCards = async () => {
        let currentPoints = housePoints;
        const dealCard = () => {
            const { card, newShoe } = shoe.popCardFromShoe();

            setHouseHand((prevState) => {
                const updatedHand = new Hand();
                updatedHand.cards = [...prevState.cards];
                if (card) {
                    updatedHand.cards.push(card);
                }
                return updatedHand;
            });

            setShoe(newShoe);
            return card as Card;
        };
        while (currentPoints < 17) {
            await new Promise((resolve) => setTimeout(resolve, delay));
            const card = dealCard();
            currentPoints = sumPoints(currentPoints, card);
        }
    };

    // const hitSplit = () => {
    //     const { hand: updatedHand, shoe: updatedShoe } = shoe.popCardsFromShoe(splitHand, 1);
    //     setSplitHand(updatedHand);
    //     setShoe(updatedShoe);
    //     evaluatePlayerBust(updatedHand.sumPoints());
    // };

    // const double = () => {
    //     // Double the bet
    //     // Draw one more card
    //     if (isSplit) {
    //         hitSplit();
    //     } else {
    //         handleHit();
    //     }
    //     // Stand automatically
    //     handleStand();
    // };

    // const split = () => {
    //     // Split the player's hand into two new hands
    //     const hand1 = new Hand();
    //     hand1.cards.push(playerHand.cards[0]);
    //     setPlayerHand(hand1);
    //     const hand2 = new Hand();
    //     hand2.cards.push(playerHand.cards[1]);
    //     setSplitHand(hand2);
    // };

    const handleStand = async () => {
        // Finish the player's game
        setIsDealing(true);
        setIsFirstTurn(false);
        await dealHouseCards();
        setIsLastTurn(true);
    };

    return (
        <main className="flex flex-col items-center min-h-screen p-24">
            <h1>Blackjack</h1>
            <span className="mb-2">{gameMessage}</span>
            <span>Shoe: {shoe.decks.length}</span>
            <span>House hand: {housePoints}</span>
            <HandComponent hand={houseHand} />
            <span>Player hand: {playerPoints}</span>
            <HandComponent hand={playerHand} />
            <div className="flex gap-2 mt-2">
                {!isDealing && !isGameOver && (
                    <>
                        {playerHand.cards.length >= 2 && <button onClick={handleHit}>Hit</button>}
                        <button onClick={handleStand}>Stand</button>
                    </>
                )}
                {isGameOver && <>{<button onClick={handleStart}>Start</button>}</>}
            </div>
        </main>
    );
}
