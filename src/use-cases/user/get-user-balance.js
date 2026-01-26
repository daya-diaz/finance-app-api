import { UserNotFoundError } from '../../errors/user.js'

export class GetUserBalanceUseCase {
    constructor(getUserBalanceRepository, getUserByIdRepository) {
        this.getUserBalanceRepository = getUserBalanceRepository
        this.getUserByIdRepository = getUserByIdRepository
    }

    async execute(params) {
        const userExists = await this.getUserByIdRepository.execute(
            params.userId,
        )

        if (!userExists) {
            throw new UserNotFoundError(params.userId)
        }

        const userBalance = await this.getUserBalanceRepository.execute(
            params.userId,
        )

        return userBalance
    }
}
