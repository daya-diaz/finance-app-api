import { PostgresHelper } from '../../../db/postgres/helper.js'

export class PostgresGetUserBalanceRepository {
    async execute(userId) {
        const userBalance = await PostgresHelper.query(
            `SELECT * FROM get_user_balance($1)`,
            [userId],
        )

        return {
            userId,
            ...userBalance[0],
        }
    }
}
