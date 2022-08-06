import Head from 'next/head';
import axios from "axios";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from "react-hook-form";

export default function Create() {
    const [userData, setUserData] = useState();
    const [loading, setLoading] = useState(true);
    const [players, setPlayers] = useState([]);
    const [score, setScore] = useState(0);
    const [checkedItems, setCheckedItems] = useState({});
    const router = useRouter();
    const { handleSubmit, register, formState: { errors } } = useForm();

    useEffect(() => {
        axios.get("/api/user")
        .then((res) => {
            setUserData(res.data);
            setLoading(false);
        });
    });

    const handleChange = event => {
        setCheckedItems({
          ...checkedItems,
          [event.target.name]: event.target.checked
        });

        let tempPlayers = players;

        if (tempPlayers.includes(event.target.name)) {
            tempPlayers = tempPlayers.filter((playerName) => playerName !== event.target.name);
            setPlayers(tempPlayers);
        } else {
            tempPlayers.push(event.target.name);
            setPlayers(tempPlayers)
        }

        console.log(tempPlayers)
    };

    const createGame = async (data) => {
        if (players.length === 2) {
            axios.post('/api/game', {
                player1: Number(players[0]),
                player2: Number(players[1]),
                scorePlayer1: Number(data.score),
                scorePlayer2: Number(data.score),
                type: data.type
            })
            .then((res) => {
                router.push(`/game/${res.data.id}`)
                console.log(res)
            });
        } else {
            console.log("Not enough or too many players.")
        }
        
    };

    return (
        <div>
            <Head>
                <title>Create new user</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <h1 className="text-3xl font-bold">New user creation</h1>
            <Link href="/">Home</Link>
            <br></br>
            {loading ? <p>Loading users..</p> : <form onSubmit={handleSubmit(createGame)}>
                {userData.map((user) => {
                    return (
                        <>
                            <label key={user.id}>
                                {user.name}
                                <input type="checkbox" name={user.id} checked={checkedItems[user.id]} onChange={handleChange}/>
                            </label>
                        </>
                    )
                })}
                <label for="score">Choose a start score:
                    <select name="score" id="score" {...register("score")}>
                        <option value="301">301</option>
                        <option value="501">501</option>
                    </select>
                </label>
                <label for="type">Choose a game type:
                    <select name="type" id="type" {...register("type")}>
                        <option value="straight-out">Straight-out</option>
                        <option value="double-out">Double-out</option>
                        <option value="first-to">First to 0</option>
                    </select>
                </label>
                <input type="submit" />
            </form>}
            
        </div>
    )
}
