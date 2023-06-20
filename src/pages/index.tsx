import { useState, useEffect } from 'react';
import HandComponent from '@/components/Hand';
import { CardInt, HandInt } from '@/lib/interfaces';
import { Hand, Shoe } from '@/lib/models';
import { sumPoints, isBust, isBlackjack } from '@/lib/utils';

export default function Game() {
    // cards flow state
    const [playerHand, setPlayerHand] = useState(() => new Hand());
    const [splitHand, setSplitHand] = useState(() => new Hand());
    const [houseHand, setHouseHand] = useState(() => new Hand());
    const [shoe, setShoe] = useState(() => new Shoe(2));
    // game flow state
    const [isDealing, setIsDealing] = useState(false);
    const [isGameOver, setIsGameOver] = useState(true);
    const [isFirstTurn, setIsFirstTurn] = useState(false);
    const [isLastTurn, setIsLastTurn] = useState(false);
    const [isDouble, setIsDouble] = useState(false);
    const [coverCard, setCoverCard] = useState(true);
    const [gameMessage, setGameMessage] = useState('');

    const playerPoints = playerHand.sumPoints();
    const splitPoints = splitHand.sumPoints();
    const housePoints = houseHand.sumPoints();

    const delay: number = 500;

    useEffect(() => {
        const handleGameOver = async (message: string) => {
            setGameMessage(message);
            setIsLastTurn(false);
            setIsDouble(false);
            setCoverCard(false);
            await resetHands();
            setIsGameOver(true);
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
                return card as CardInt;
            };
            while (currentPoints < 17) {
                await new Promise((resolve) => setTimeout(resolve, delay));
                const card = dealCard();
                currentPoints = sumPoints(currentPoints, card);
            }
        };
        const handleStand = async () => {
            // Finish the player's game
            setIsDealing(true);
            setIsFirstTurn(false);
            setCoverCard(false);
            await dealHouseCards();
            setIsLastTurn(true);
        };
        const handleDouble = async () => {
            const playerBust = isBust(playerPoints);
            if (!playerBust && isDouble) {
                await handleStand();
                setIsDouble(false);
            }
        };
        const handleBj = async () => {
            if (isFirstTurn) {
                const houseBj = isBlackjack(housePoints);
                const playerBj = isBlackjack(playerPoints);
                if (playerBj && !houseBj) {
                    await handleGameOver('You won! Blackjack');
                }
                if (!playerBj && houseBj) {
                    await handleGameOver('You lose');
                }
                if (playerBj && houseBj) {
                    await handleGameOver('Push');
                }
            }
        };
        const handleBust = async () => {
            if (!isFirstTurn) {
                const playerBust = isBust(playerPoints);
                const houseBust = isBust(housePoints);
                if (playerBust) {
                    await handleGameOver('Bust');
                }
                if (houseBust) {
                    await handleGameOver('You win. House bust');
                }
            }
        };
        const handleEndGame = async () => {
            const houseBust = isBust(housePoints);
            if (isLastTurn && !houseBust) {
                if (playerPoints > housePoints) {
                    await handleGameOver('You win');
                }
                if (playerPoints < housePoints) {
                    await handleGameOver('You lose');
                }
                if (playerPoints === housePoints) {
                    await handleGameOver('Push');
                }
            }
        };
        handleBj();
        handleBust();
        handleDouble();
        handleEndGame();
    }, [
        playerHand,
        playerPoints,
        housePoints,
        isGameOver,
        isFirstTurn,
        isLastTurn,
        isDouble,
        shoe
    ]);

    const resetHands = async () => {
        setIsDealing(true);
        await new Promise((resolve) => {
            setTimeout(resolve, 2500);
        });
        setIsDealing(false);
        setPlayerHand(new Hand());
        setHouseHand(new Hand());
        setSplitHand(new Hand());
    };

    const dealCard = (hand: HandInt) => {
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
    };

    const handleStart = async () => {
        setIsGameOver(false);
        setCoverCard(true);
        setGameMessage('');
        await dealInitialCards();
        setIsFirstTurn(true);
    };

    const handleHit = async () => {
        setIsDealing(true);
        if (isLastTurn) {
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
        dealCard(playerHand);
        setIsDealing(false);
        setIsFirstTurn(false);
    };

    const handleDouble = async () => {
        // Double the bet
        // Draw one more card
        await handleHit();
        setIsDouble(true);
    };

    const handleStand = async () => {
        // Finish the player's game
        setIsDealing(true);
        setIsFirstTurn(false);
        setCoverCard(false);
        await dealHouseCards();
        setIsLastTurn(true);
    };

    const dealInitialCards = async () => {
        setIsDealing(true);
        dealCard(playerHand);
        await new Promise((resolve) => setTimeout(resolve, delay));
        dealCard(houseHand);
        await new Promise((resolve) => setTimeout(resolve, delay));
        dealCard(playerHand);
        await new Promise((resolve) => setTimeout(resolve, delay));
        dealCard(houseHand);
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
            return card as CardInt;
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

    // const split = () => {
    //     // Split the player's hand into two new hands
    //     const hand1 = new Hand();
    //     hand1.cards.push(playerHand.cards[0]);
    //     setPlayerHand(hand1);
    //     const hand2 = new Hand();
    //     hand2.cards.push(playerHand.cards[1]);
    //     setSplitHand(hand2);
    // };

    return (
        <main className="flex flex-col items-center min-h-screen p-24">
            {/* <h1>Blackjack</h1> */}
            <span className="font-semibold h-10 mb-2">{gameMessage}</span>
            <span className="mb-2">Shoe: {shoe.decks.length}</span>
            <div className="relative">
                {!coverCard && !isGameOver && (
                    <span className="absolute flex -left-8 inset-y-0 items-center">
                        {housePoints}
                    </span>
                )}
                <HandComponent hand={houseHand} coverCard={coverCard} />
            </div>
            <div className="relative">
                {!isGameOver && (
                    <span className="absolute flex -left-8 inset-y-0 items-center">
                        {playerPoints}
                    </span>
                )}
                <HandComponent hand={playerHand} />
            </div>
            <div className="flex gap-2 mt-2">
                {!isDealing && !isGameOver && (
                    <>
                        <button onClick={handleHit}>Hit</button>
                        {isFirstTurn && <button onClick={handleDouble}>Double</button>}
                        <button onClick={handleStand}>Stand</button>
                    </>
                )}
                {isGameOver && <>{<button onClick={handleStart}>Start</button>}</>}
            </div>
        </main>
    );
}
