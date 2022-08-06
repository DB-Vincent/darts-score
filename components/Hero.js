import { useRouter } from 'next/router';

const Hero = () => {
    const router = useRouter();

    return (
        <div className="w-full text-center py-8">
            <h1 className="text-3xl font-bold mb-4">🎯 Darts score</h1>
            <button className="inline-block rounded-lg py-3 px-4 bg-cyan-600 font-medium text-white hover:bg-cyan-800 mx-2" onClick={() => { router.push('/user/new') }}>New player</button>
            <button className="inline-block rounded-lg py-3 px-4 bg-cyan-600 font-medium text-white hover:bg-cyan-800 mx-2" onClick={() => { router.push('/game/new') }}>New game</button>
        </div>
    )
}

export default Hero