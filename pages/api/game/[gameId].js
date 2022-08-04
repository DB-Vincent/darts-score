import { PrismaClient } from '@prisma/client';

export default async (req, res) => {
    const { gameId } = req.query
    const prisma = new PrismaClient()

    await prisma.game.findUnique({ 
        where: {
            id: Number(gameId)
        },
        include: {
            player1: true,
            player2: true
        }
    }).then(async (game) => {
        res.status(200).json(game);
        await prisma.$disconnect();
    }).catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
    });
}