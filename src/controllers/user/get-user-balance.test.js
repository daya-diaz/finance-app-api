import { UserNotFoundError } from '../../errors/user'
import { serverError } from '../helpers'
import { GetUserBalanceController } from './get-user-balance'
import { faker } from '@faker-js/faker'

describe('GetUserBalanceController', () => {
    class GetUserBalanceUseCaseStub {
        execute() {
            return {
                totalExpenses: faker.number.int({ min: 1000, max: 1000 }),
                totalEarnings: faker.number.int({ min: 2000, max: 2000 }),
                totalInvestments: faker.number.int({ min: 500, max: 500 }),
                balance: faker.number.int({ min: 500, max: 500 }),
            }
        }
    }

    const makeSut = () => {
        const getUserBalanceUseCase = new GetUserBalanceUseCaseStub()
        const sut = new GetUserBalanceController(getUserBalanceUseCase)

        return {
            getUserBalanceUseCase,
            sut,
        }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    }

    it('should return 200 when get user balance successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 500 if throws a server error', async () => {
        // arrange
        const { sut, getUserBalanceUseCase } = makeSut()

        // act
        jest.spyOn(getUserBalanceUseCase, 'execute').mockImplementationOnce(
            () => {
                throw new serverError()
            },
        )

        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(500)
    })

    it('should return 400 when user id is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({ params: { userId: 'invalid' } })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 404 when user is not found', async () => {
        // arrange
        const { sut, getUserBalanceUseCase } = makeSut()

        // act
        jest.spyOn(getUserBalanceUseCase, 'execute').mockImplementationOnce(
            () => {
                throw new UserNotFoundError()
            },
        )

        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(404)
    })

    it('should return 500 if throws an server error', async () => {
        // arrange
        const { sut, getUserBalanceUseCase } = makeSut()

        // act
        jest.spyOn(getUserBalanceUseCase, 'execute').mockImplementationOnce(
            () => {
                throw new serverError()
            },
        )

        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(500)
    })

    it('should return 500 if GetUserByIdUseCase throws', async () => {
        // arrange
        const { sut, getUserBalanceUseCase } = makeSut()

        // act
        jest.spyOn(getUserBalanceUseCase, 'execute').mockRejectedValue(
            new Error(),
        )

        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(500)
    })

    it('should call GetUserBalanceUseCase with correct params', async () => {
        // arrange
        const { getUserBalanceUseCase, sut } = makeSut()

        const executeSpy = jest.spyOn(getUserBalanceUseCase, 'execute')

        // act
        await sut.execute(httpRequest)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId)
        expect(executeSpy).toHaveBeenCalledTimes(1)
    })
})
