import Head from 'next/head';
import axios from "axios";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter } from 'next/router'

export default function Create() {
    const [userData, setUserData] = useState();
    const [loading, setLoading] = useState(true);
    const [players, setPlayers] = useState([])
    const router = useRouter()

    useEffect(() => {
        axios.get("/api/user")
        .then((res) => {
            setUserData(res.data);
            setLoading(false);
        });
    });

    const handleOnChange = (player) => {
        let tempPlayers = players;

        if (tempPlayers.includes(player)) {
            tempPlayers = tempPlayers.filter((playerName) => playerName !== player);
            setPlayers(tempPlayers);
        } else {
            tempPlayers.push(player);
            setPlayers(tempPlayers)
        }
    };
    
    const createGame = async (event) => {
        event.preventDefault();
        
        axios.post('/api/game', {
            player1: Number(players[0]),
            player2: Number(players[1]),
            score: 501
        })
        .then((res) => {
            router.push(`/game/${res.data.id}`)
            console.log(res)
        });
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
            {loading ? <p>Loading users..</p> : <form onSubmit={createGame}>
                {userData.map((user) => {
                    return (
                        <>
                            <input id="name" name="name" value={user.name} type="checkbox" onChange={() => handleOnChange(user.id)}/> 
                            <label htmlFor="name"> {user.name}</label><br></br>
                        </>
                    )
                })}
                
                <button type="submit">Create</button>
            </form>}
            
        </div>
    )
}
