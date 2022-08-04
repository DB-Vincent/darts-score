import { PrismaClient } from '@prisma/client';

export default async (req, res) => {
    const prisma = new PrismaClient()

    if (req.method === 'POST') {
        await prisma.game.create({ 
            data: {
                player1Id: req.body.player1,
                player2Id: req.body.player2,
                scorePlayer1: req.body.scorePlayer1,
                scorePlayer2: req.body.scorePlayer2
            }
        }).then(async (game) => {
            await prisma.$disconnect();
            res.status(200).json(game);
        }).catch(async (e) => {
            console.error(e);
            await prisma.$disconnect();
        });
    } else if (req.method === 'DELETE') {
        const checkGame = await prisma.game.count({
            where: {
                id: req.body.id,
            },
        }).then(async () => {
            await prisma.$disconnect();
        }).catch(async (e) => {
            console.error(e);
            await prisma.$disconnect();
        });

        if (checkGame === 1) {        
            await prisma.game.delete({
                where: {
                    id: req.body.id,
                },
            }).then(async (game) => {
                await prisma.$disconnect();
                res.status(200).json(game);
            }).catch(async (e) => {
                console.error(e);
                await prisma.$disconnect();
            });
        } else {
            res.status(200).json({ "error": "Game doesn't exist!" });
        }        
    } else if (req.method === 'GET') {
        await prisma.game.findMany({
            include: {
                player1: true,
                player2: true
            }
        }).then(async (games) => {
            await prisma.$disconnect();
            res.status(200).json(games);
        }).catch(async (e) => {
            console.error(e);
            await prisma.$disconnect();
        });
    } else {
        res.status(200).json({ "error": "I think you're doing something wrong." });
    }
};