import Head from 'next/head';
import axios from "axios";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';

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
                if (res.data.error) toast.error(`Error: ${res.data.error}`)
                else router.push(`/game/${res.data.id}`)
            });
        } else {
            toast.error(`You need to select 2 players! You've selected ${players.length}`)
        }
        
    };

    return (
        <div>
            <Head>
                <title>Create new game</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="container mx-auto px-4">
                <h1 className="text-3xl font-bold w-full text-center mt-6">Create game</h1>
                <Link href="/">🠔 Home</Link>
                
                <div className="mt-4">
                    {loading ? <p>Loading users..</p> : <form onSubmit={handleSubmit(createGame)} className="flex flex-col">
                        <span className="text-gray-700 block">Choose 2 players:</span>
                        {userData.map((user) => {
                            return (
                                <label key={user.id}>
                                    <input type="checkbox" className="form-checkbox mr-2" name={user.id} checked={checkedItems[user.id]} onChange={handleChange}/>
                                    <span className="text-gray-700">{user.name}</span>
                                </label>
                                
                            )
                        })}

                        <label htmlFor="score" className="mt-2">
                            <span className="text-gray-700 block">Choose a start score:</span>
                            <select name="score" id="score" className="form-select" {...register("score")}>
                                <option value="301">301</option>
                                <option value="501">501</option>
                            </select>
                        </label>

                        <label htmlFor="type" className="mt-2">
                            <span className="text-gray-700 block">Choose a type of game:</span>
                            <select className="block form-select" name="type" id="type" {...register("type")}>
                                <option value="straight-out">Straight-out</option>
                                <option value="double-out">Double-out</option>
                                <option value="first-to">First to 0</option>
                            </select>
                        </label>
                        <button type="submit" className="inline-block rounded-lg py-3 px-4 bg-cyan-600 font-medium text-white hover:bg-cyan-800 mt-4">Create player</button>
                    </form>}
                </div>
                <Toaster position="top-center"/>
            </main>
        </div>
    )
}
