import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [gameData, setGameData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/game")
    .then((res) => {
      setGameData(res.data);
      setLoading(false);
    });
  });

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Link href="/user/new">Create new user</Link>
      <Link href="/game/new">Create new game</Link>

      { loading ? <p>Loading data..</p> : <table>
        <tr>
          <th>Game date</th>
          <th>Player 1</th>
          <th>Player 2</th>
          <th>Score</th>
        </tr>
        { gameData.map((game) => {
          return (
          <tr>
            <td>{game.createdAt}</td>
            <td>{game.player1.name}</td>
            <td>{game.player2.name}</td>
            <td>{game.scorePlayer1} / {game.scorePlayer2}</td>
          </tr>
          )
        }) }
      </table>}
    </div>
  )
}
