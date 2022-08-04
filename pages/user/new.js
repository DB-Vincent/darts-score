import Head from 'next/head';
import axios from "axios";
import Link from 'next/link';

export default function Create() {
  const createUser = async (event) => {
    event.preventDefault();
    
    axios.post('/api/user', {
      name: event.target.name.value,
    })
    .then((res) => {
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
      <form onSubmit={createUser}>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" autoComplete="name" required/>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}
