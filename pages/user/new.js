import Head from 'next/head';
import axios from "axios";
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function Create() {
  const createUser = async (event) => {
    event.preventDefault();
    
    axios.post('/api/user', {
      name: event.target.name.value,
    })
    .then((res) => {
      if (res.error) toast.error(`Error: ${res.data.error}`);
      else toast.success(`Player ${res.data.name} created!`);
      
      console.log(res)
    });
  };

  return (
    <div>
      <Head>
        <title>Create new player</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4">
        <h1 className="text-3xl font-bold w-full text-center mt-6">Create player</h1>
        <Link href="/">🠔 Home</Link>
        
        <form onSubmit={createUser} className="mt-4">
          <span className="text-gray-700">Name:</span>
          <input className="form-input mt-1 block w-full" id="name" name="name" type="text" autoComplete="name" placeholder="Alain Van Dam" required/>
          <button type="submit" className="inline-block rounded-lg py-3 px-4 bg-cyan-600 font-medium text-white hover:bg-cyan-800 mt-4">Create player</button>
        </form>
      </main>
      <Toaster position="top-center"/>
    </div>
  )
}
