import Head from 'next/head';

import GameList from '../components/GameList';
import Hero from '../components/Hero';
import UserList from '../components/UserList';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Darts score</title>
        <meta name="description" content="NextJS application to calculate darts scores" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4">
        <Hero />
        <GameList />
        <UserList />
      </main>
    </div>
  )
}
