import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id'
import { serverError } from '../helpers'
import { UserNotFoundError } from '../../errors/user'

describe('GetTransactionsByUserId', () => {
    class GetUserByUserIdUseCaseStub {
        async execute() {
            return [
                {
                    user_id: faker.string.uuid(),
                    id: faker.string.uuid(),
                    name: faker.commerce.productName(),
                    date: faker.date.anytime().toISOString(),
                    type: 'EARNING',
                    amount: Number(faker.finance.amount()),
                },
            ]
        }
    }

    const makeSut = () => {
        const getUserByUserIdUseCase = new GetUserByUserIdUseCaseStub()
        const sut = new GetTransactionsByUserIdController(
            getUserByUserIdUseCase,
        )

        return {
            getUserByUserIdUseCase,
            sut,
        }
    }

    it('should return 200 when finding transaction by user id successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            query: {
                userId: faker.string.uuid(),
            },
        })
        // assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if userId is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            query: {},
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if userId is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            query: {
                userId: 'invalid_userid',
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 500 if GetUserByUserIdUseCase throws', async () => {
        // arrange
        const { sut, getUserByUserIdUseCase } = makeSut()
        jest.spyOn(getUserByUserIdUseCase, 'execute').mockRejectedValue(
            serverError(),
        )

        // act
        const result = await sut.execute({
            query: {
                userId: faker.string.uuid(),
            },
        })

        // assert
        expect(result.statusCode).toBe(500)
    })

    it('should return 404 if GetUserByUseridUseCase throws a UserNotFoundError', async () => {
        // arrange
        const { sut, getUserByUserIdUseCase } = makeSut()
        jest.spyOn(getUserByUserIdUseCase, 'execute').mockRejectedValue(
            new UserNotFoundError(),
        )

        // act
        const result = await sut.execute({
            query: {
                userId: faker.string.uuid(),
            },
        })

        // assert
        expect(result.statusCode).toBe(404)
    })

    it('should call GetTransactionByUserIdUseCase with correct params', async () => {
        const { sut, getUserByUserIdUseCase } = makeSut()

        const executeSpy = jest.spyOn(getUserByUserIdUseCase, 'execute')

        const userId = faker.string.uuid()

        // act
        await sut.execute({
            query: {
                userId,
            },
        })

        // assert
        expect(executeSpy).toHaveBeenCalledWith(userId)
        expect(executeSpy).toHaveBeenCalledTimes(1)
    })
})
