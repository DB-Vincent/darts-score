import { useRouter } from 'next/router';
import { useState, useEffect } from "react";
import axios from "axios";

export default function Page() {
    const router = useRouter();
    const { gameId } = router.query;

    const [gameData, setGameData] = useState();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (gameId) {
            axios.get(`/api/game/${gameId}`)
            .then((res) => {
                setGameData(res.data);
                setLoading(false);
            });
        }
    });

    return (
        <div>
            { loading ? <p>Loading data..</p> : <>
                <h1>Game ID: {gameData.id}</h1>

                <p>Player 1: {gameData.player1.name}</p>
                <p>Player 2: {gameData.player2.name}</p>
                <p>Score: {gameData.score}</p>
            </>}
            
        </div>
    );
}