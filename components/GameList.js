import { useState, useEffect } from "react";
import axios from "axios";
import Link from 'next/link';

const GameList = () => {
    const [gameData, setGameData] = useState();
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      axios.get("/api/game")
      .then((res) => {
        setGameData(res.data);
        setLoading(false);
      });
    }, []);

    return (
        <div className="mb-4">
            <h2 className="text-2xl font-bold mb-4">Games</h2>
            { loading 
            ? <p className="w-full text-center text-slate-400">Loading games..</p> 
            : <ul className="list-none">
                { gameData.length != 0
                ? <>
                    { gameData.map((game) => {
                        console.log(game)
                        return (
                            <li key={game.id}>
                                {game.winner 
                                ? <p><span className="text-medium">{game.player1.name}</span> vs <span className="text-medium">{game.player2.name}</span>: {game.winner.name} won!</p>
                                : <a href={"/game/" + game.id}><span className="text-medium">{game.player1.name}</span> vs <span className="text-medium">{game.player2.name}</span>: {game.scorePlayer1}/{game.scorePlayer2}</a>}
                            </li>
                            
                        )
                    })}
                </>
                : <p className="text-slate-400">No games played yet!</p> }                
            </ul>}
        </div >
    )
}

export default GameList