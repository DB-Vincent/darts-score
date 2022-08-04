import { PrismaClient } from '@prisma/client';

export default async (req, res) => {
    const { userId } = req.query
    const prisma = new PrismaClient()

    await prisma.user.findUnique({ 
        where: {
            id: Number(userId)
        },
        include: {
            gamesAsPlayer1: true,
            gamesAsPlayer2: true
        }
    }).then(async (user) => {
        res.status(200).json(user);
        await prisma.$disconnect();
    }).catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
    });
}