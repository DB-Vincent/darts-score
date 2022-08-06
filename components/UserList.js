import { useState, useEffect } from "react";
import axios from "axios";

const UserList = () => {
    const [userData, setUserData] = useState();
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      axios.get("/api/user")
      .then((res) => {
        setUserData(res.data);
        setLoading(false);
      });
    }, []);

    return (
        <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">Users</h2>
            { loading 
            ? <p className="w-full text-center text-slate-400">Loading users..</p> 
            : <ul className="list-none">
                { userData.length != 0
                ? <>
                    { userData.map((user) => {
                        return (
                            <li key={userData.id} className="mb-2">
                                <h3 className="text-xl font-medium">{user.name}</h3>
                                <p>Games played: {user.gamesAsPlayer1.length + user.gamesAsPlayer2.length}</p>
                                <p>Games won: {user.gamesWon.length}</p>
                            </li>
                        )
                    })}
                </>
                : <p className="text-slate-400">No users added yet!</p> }                
            </ul>}
        </div>
    )
}

export default UserList