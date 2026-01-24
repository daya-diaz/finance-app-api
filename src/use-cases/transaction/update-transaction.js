import { UserNotFoundError } from '../../errors/user.js'

export class UpdateTransactionUseCase {
    constructor(getUserByIdRepository, updateTransactionRepository) {
        this.getUserByIdRepository = getUserByIdRepository
        this.updateTransactionRepository = updateTransactionRepository
    }
    async execute(params) {
        const user = await this.getUserByIdRepository.execute(params.userId)
        if (!user) {
            throw new UserNotFoundError()
        }

        const updatedTransaction =
            await this.updateTransactionRepository.execute(params)

        return updatedTransaction
    }
}
