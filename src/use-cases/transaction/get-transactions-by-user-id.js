import { UserNotFoundError } from '../../errors/user.js'

export class GetTransactionsByUserIdUseCase {
    constructor(
        getUserByIdRepository,
        postgresGetTransactionsByUserIdRepository,
    ) {
        ;(this.getUserByIdRepository = getUserByIdRepository),
            (this.postgresGetTransactionsByUserIdRepository =
                postgresGetTransactionsByUserIdRepository)
    }

    async execute(userId) {
        const userExists = await this.getUserByIdRepository.execute(userId)

        if (!userExists) throw new UserNotFoundError(userId)

        const transactions =
            await this.postgresGetTransactionsByUserIdRepository.execute(userId)

        return transactions
    }
}
