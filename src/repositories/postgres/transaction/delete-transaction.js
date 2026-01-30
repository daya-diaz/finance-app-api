import prisma from '../../../../prisma/prisma.js'

export class PostgresDeleteTransactionRepository {
    async execute(transactionId) {
        try {
            return await prisma.transaction.delete({
                where: {
                    id: transactionId,
                },
            })
        } catch (error) {
            if (error.code === 'P2025') {
                // Prisma's "Record to delete does not exist" error
                return null
            }
            throw error // Re-throw other unexpected errors
        }
    }
}
