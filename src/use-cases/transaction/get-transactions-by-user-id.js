import { UserNotFoundError } from '../../errors/user.js'

export class GetTransactionsByUserIdUseCase {
    constructor(
        getUserByIdRepository,
        postgresGetTransactionsByUserIdRepository,
    ) {
        ;(this.getUserByIdRepository = getUserByIdRepository)(
            (this.postgresGetTransactionsByUserIdRepository =
                postgresGetTransactionsByUserIdRepository),
        )
    }

    async execute(params) {
        const userExists = await this.getUserByIdRepository.execute(
            params.userId,
        )

        if (!userExists) throw new UserNotFoundError(params.userId)

        const transactions =
            await this.postgresGetTransactionsByUserIdRepository.execute(
                params.userId,
            )

        return transactions
    }
}
