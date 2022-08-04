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
    const [checkedItems, setCheckedItems] = useState({});
    const router = useRouter();
    const { handleSubmit, watch, formState: { errors } } = useForm();

    useEffect(() => {
        axios.get("/api/user")
        .then((res) => {
            setUserData(res.data);
            setLoading(false);
        });
    });

    const Checkbox = ({ type = "checkbox", name, checked = false, onChange }) => {      
        return (
            <input type={type} name={name} checked={checked} onChange={onChange} />
        );
    };

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

    const createGame = async () => {   
        if (players.length === 2) {
            axios.post('/api/game', {
                player1: Number(players[0]),
                player2: Number(players[1]),
                score: 501
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
                                <Checkbox
                                    name={user.id}
                                    checked={checkedItems[user.id]}
                                    onChange={handleChange}
                                />
                            </label>
                        </>
                    )
                })}
                
                <input type="submit" />
            </form>}
            
        </div>
    )
}
