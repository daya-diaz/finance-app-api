import { Prisma } from '@prisma/client'
import prisma from '../../../../prisma/prisma.js'

export class PostgresGetUserBalanceRepository {
    async execute(userId) {
        const {
            _sum: { amount: totalExpenses },
        } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: 'EXPENSE',
            },
            _sum: {
                amount: true,
            },
        })
        const {
            _sum: { amount: totalEarnings },
        } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: 'EARNING',
            },
            _sum: {
                amount: true,
            },
        })
        const {
            _sum: { amount: totalInvestments },
        } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: 'INVESTMENT',
            },
            _sum: {
                amount: true,
            },
        })

        const balance = totalEarnings - totalExpenses - totalInvestments

        return {
            totalExpenses: totalExpenses || new Prisma.Decimal(0),
            totalEarnings: totalEarnings || new Prisma.Decimal(0),
            totalInvestments: totalInvestments || new Prisma.Decimal(0),
            balance: new Prisma.Decimal(balance),
        }
    }
}
