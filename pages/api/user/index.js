import { PrismaClient } from '@prisma/client';

export default async (req, res) => {
    const prisma = new PrismaClient()

    if (req.method === 'POST') {
        await prisma.user.count({
            where: {
                name: req.body.name,
            },
        }).then(async (checkUser) => {
            if (checkUser === 0) {
                await prisma.user.create({ 
                    data: {
                        name: req.body.name
                    }
                }).then(async (user) => {
                    await prisma.$disconnect();
                    res.status(200).json(user);
                }).catch(async (e) => {
                    console.error(e);
                    await prisma.$disconnect();
                });
            } else {
                res.status(200).json({ "error": "User exists!" });
            }
            await prisma.$disconnect();
        }).catch(async (e) => {
            console.error(e);
            await prisma.$disconnect();
        });
    } else if (req.method === 'DELETE') {
        const checkUser = await prisma.user.count({
            where: {
                id: req.body.id,
            },
        }).then(async () => {
            await prisma.$disconnect();
        }).catch(async (e) => {
            console.error(e);
            await prisma.$disconnect();
        });

        if (checkUser === 1) {        
            const deleteUser = await prisma.user.delete({
                where: {
                    id: req.body.id,
                },
            }).then(async (user) => {
                await prisma.$disconnect();
                res.status(200).json(user);
                await prisma.$disconnect();
            }).catch(async (e) => {
                console.error(e);
                await prisma.$disconnect();
            });

            res.status(200).json(deleteUser);
        } else {
            res.status(200).json({ "error": "User doesn't exist!" });
        }        
    } else if (req.method === 'GET') {
        await prisma.user.findMany().then(async (user) => {
            await prisma.$disconnect();
            res.status(200).json(user);
        }).catch(async (e) => {
            console.error(e);
            await prisma.$disconnect();
        });
    } else {
        res.status(200).json({ "error": "I think you're doing something wrong." });
    }
};