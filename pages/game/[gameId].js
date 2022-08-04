import { useRouter } from 'next/router';
import { useState, useEffect } from "react";
import axios from "axios";

export default function Page() {
    const router = useRouter();
    const { gameId } = router.query;

    const [gameData, setGameData] = useState();
    const [loading, setLoading] = useState(true);
    const [scorePlayer1, updateScorePlayer1] = useState(0);
    const [scorePlayer2, updateScorePlayer2] = useState(0);

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
            updateScorePlayer2(res.data.scorePlayer2)

            setLoading(false);
        });
    }, [router.isReady]);

    const addDart = (score) => {
        let player1 = scorePlayer1;
        let player2 = scorePlayer2;

        if (currentPlayer === 0) {
            if (double) {
                player1 = player1 - (score * 2)
                setDouble(!double)
            } else if (triple) {
                player1 = player1 - (score * 3)
                setTriple(!triple)
            } else player1 = player1 - score

            updateScorePlayer1(player1)
        } else {
            if (double) {
                player2 = player1 - (score * 2)
                setDouble(!double)
            } else if (triple) {
                player2 = player2 - (score * 3)
                setTriple(!triple)
            } else player2 = player2 - score

            updateScorePlayer2(player2)
        }

        let listOfDarts = currentDarts
        listOfDarts.push(score)
        updateCurrentDarts(listOfDarts)
        
        if ((listOfDarts.length % 3) === 0) {
            if (currentPlayer === 0) updateCurrentPlayer(1)
            else updateCurrentPlayer(0)

            axios.post(`/api/game/${gameId}`, {
                scorePlayer1: player1,
                scorePlayer2: player2
            })
            .then((res) => {
                console.log(res)
            });
        }
    }

    return (
        <div>
            { loading ? <p>Loading data..</p> : <>
                <h1>Game ID: {gameData.id}</h1>

                <p>{gameData.player1.name}: {scorePlayer1}</p>
                <p>{gameData.player2.name}: {scorePlayer2}</p>
            
                <div className='grid grid-cols-3 grid-rows-8 gap-4'>
                    <button onClick={() => { addDart(0) }}>Miss</button>
                    <button onClick={() => { setDouble(!double) }}>Double</button>
                    <button onClick={() => { setTriple(!triple) }}>Triple</button>
                    { [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25].map((score) => {
                        return <button onClick={() => { addDart(score) }}>{score}</button>
                    }) }
                </div>
            </>}
        </div>
    );
}