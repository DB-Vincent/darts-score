import { PrismaClient } from '@prisma/client';

export default async (req, res) => {
    const { gameId } = req.query
    const prisma = new PrismaClient()

    if (req.method === 'GET') {
        await prisma.game.findUnique({ 
            where: {
                id: Number(gameId)
            },
            include: {
                player1: true,
                player2: true,
                winner: true
            }
        }).then(async (game) => {
            res.status(200).json(game);
            await prisma.$disconnect();
        }).catch(async (e) => {
            console.error(e);
            await prisma.$disconnect();
        });
    } else if (req.method === 'POST') {
        if (req.body.winnerId) {
            await prisma.game.update({
                select: {
                    id: true,
                    scorePlayer1: true,
                    scorePlayer2: true,
                    player1: true,
                    player2: true,
                    winner: true
                },
                where: {
                    id: Number(gameId)
                },
                data: {
                    scorePlayer1: req.body.scorePlayer1,
                    scorePlayer2: req.body.scorePlayer2,
                    currentPlayer: req.body.currentPlayer,
                    winnerId: req.body.winnerId
                }
            }).then(async (game) => {
                res.status(200).json(game);
                await prisma.$disconnect();
            }).catch(async (e) => {
                console.error(e);
                await prisma.$disconnect();
            });
        } else {
            await prisma.game.update({
                select: {
                    id: true,
                    scorePlayer1: true,
                    scorePlayer2: true,
                    player1: true,
                    player2: true,
                    winner: true
                },
                where: {
                    id: Number(gameId)
                },
                data: {
                    scorePlayer1: req.body.scorePlayer1,
                    scorePlayer2: req.body.scorePlayer2,
                    currentPlayer: req.body.currentPlayer
                }
            }).then(async (game) => {
                res.status(200).json(game);
                await prisma.$disconnect();
            }).catch(async (e) => {
                console.error(e);
                await prisma.$disconnect();
            });
        }
        
    }
    
}