import { useRouter } from 'next/router';
import { useState, useEffect } from "react";
import axios from "axios";
import Head from 'next/head';
import Link from 'next/link';

export default function Page() {
    const router = useRouter();
    const { gameId } = router.query;

    const [gameData, setGameData] = useState();
    const [loading, setLoading] = useState(true);
    const [scorePlayer1, updateScorePlayer1] = useState(0);
    const [scorePlayer2, updateScorePlayer2] = useState(0);
    const [lastScorePlayer1, updateLastScorePlayer1] = useState(0);
    const [lastScorePlayer2, updateLastScorePlayer2] = useState(0);
    const [gameType, setGameType] = useState();

    const [double, setDouble] = useState(false);
    const [triple, setTriple] = useState(false);

    const [currentPlayer, updateCurrentPlayer] = useState(0);
    const [currentDarts, updateCurrentDarts] = useState([]);

    useEffect(() => {
        if(!router.isReady) return;

        axios.get(`/api/game/${gameId}`)
        .then((res) => {
            setGameData(res.data);

            updateScorePlayer1(res.data.scorePlayer1);
            updateScorePlayer2(res.data.scorePlayer2);
            updateCurrentPlayer(res.data.currentPlayer);
            setGameType(res.data.type);
            updateLastScorePlayer1(res.data.scorePlayer1)
            updateLastScorePlayer2(res.data.scorePlayer2)

            setLoading(false);
        });
    }, [router.isReady]);

    const isWinningDart = (dart) => {
        let currentScore = 0

        if (currentPlayer === 0) currentScore = scorePlayer1
        else currentScore = scorePlayer2

        if (gameType === 'straight-out') {
            if ((currentScore - dart) === 0) return true
        } else if (gameType === 'double-out') {
            if ((currentScore - dart) === 0 && (double || triple)) return true
        } else if (gameType === 'first-to') {
            if ((currentScore - dart) <= 0) return true
        }

        return false
    }

    const addDart = (score) => {
        let player1 = scorePlayer1;
        let player2 = scorePlayer2;

        let current = 0;
        if (currentPlayer === 0) current = 1
        else current = 0

        if (double) score = score * 2
        else if (triple) score = score * 3

        let listOfDarts = currentDarts
        listOfDarts.push(score)
        updateCurrentDarts(listOfDarts)
        console.log(listOfDarts)

        if (isWinningDart(score)) {
            let winnerId = 0;

            if (currentPlayer === 0) {
                updateScorePlayer1(0)

                player1 = 0
                winnerId = gameData.player1.id
            } else {
                updateScorePlayer2(0)

                player2 = 0
                winnerId = gameData.player2.id
            }

            axios.post(`/api/game/${gameId}`, {
                scorePlayer1: player1,
                scorePlayer2: player2,
                currentPlayer: current,
                winnerId: winnerId,
            })
            .then((res) => {
                console.log(res)
                setGameData(res.data);
            });
        } else {
            if (currentPlayer === 0) updateScorePlayer1(currentScore => currentScore - score)
            else updateScorePlayer2(currentScore => currentScore - score)

            if (double) setDouble(!double)
            if (triple) setTriple(!triple)

            if ((player1 - score) <= 0) {
                updateScorePlayer1(lastScorePlayer1)
                updateCurrentPlayer(current)
                console.log(player1 - score)
                console.log(lastScorePlayer1)
            } else if ((player2 - score) <= 0) {
                updateScorePlayer2(lastScorePlayer2)
                updateCurrentPlayer(current)
                console.log(player2 - score)
                console.log(lastScorePlayer1)
            }

            if ((listOfDarts.length % 3) === 0) {
                updateCurrentPlayer(current)
                updateLastScorePlayer1(player1)
                updateLastScorePlayer2(player2)

                axios.post(`/api/game/${gameId}`, {
                    scorePlayer1: player1,
                    scorePlayer2: player2,
                    currentPlayer: current
                })
                .then((res) => {
                    console.log(res)
                });
            }
        }
    }

    return (
        <div>
            <Head>
                <title>Darts score</title>
                <meta name="description" content="NextJS application to calculate darts scores" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="container mx-auto px-4">
                { loading ? <p>Loading data..</p> : <>

                    <div className="mt-4 w-full">
                        <div className={currentPlayer === 0 ? "w-2/3 border-2 bg-slate-300 inline-block p-4" : "w-1/3 border inline-block p-4" }>
                            <span className="block text-xl">{gameData.player1.name}</span>
                            <span className="text-2xl text-bold">{scorePlayer1}</span>
                        </div>
                        <div className={currentPlayer === 1 ? "w-2/3 border-2 bg-slate-300 inline-block p-4" : "w-1/3 border inline-block p-4" }>
                            <span className="block text-xl">{gameData.player2.name}</span>
                            <span className="text-2xl text-bold">{scorePlayer2}</span>
                        </div>
                    </div>
                
                    {(gameData.winner) 
                    ? <div className="text-3xl w-full text-center">
                        <iframe src="https://giphy.com/embed/EWWdvQngcLt6g" width="480" height="284" frameBorder="0" allowFullScreen></iframe><p></p>
                        Congratulations {gameData.winner.name}, you won! 🎉
                        <Link href="/">Get back home</Link>
                    </div>
                    : <div className='grid grid-cols-3 grid-rows-8 gap-2 mt-8'>
                        <button className="inline-block rounded-lg w-full py-3 px-4 bg-green-600 font-medium text-xl text-white hover:bg-green-800" onClick={() => { addDart(0) }}>Miss</button>
                        <button className="inline-block rounded-lg w-full py-3 px-4 bg-green-600 font-medium text-xl text-white hover:bg-green-800" onClick={() => { 
                            setDouble(!double)
                            if (triple) setTriple(!triple) 
                        }}>Double</button>
                        <button className="inline-block rounded-lg w-full py-3 px-4 bg-green-600 font-medium text-xl text-white hover:bg-green-800" onClick={() => { 
                            setTriple(!triple) 
                            if (double) setTriple(!double) 
                        }}>Triple</button>
                        { [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25].map((score) => {
                            return <button key={score} className="inline-block rounded-lg w-full py-3 px-4 bg-cyan-600 font-medium text-xl text-white hover:bg-cyan-800" onClick={() => { addDart(score) }}>{score}</button>
                        }) }
                    </div>}
                </>}
            </main>
        </div>
        
    );
}