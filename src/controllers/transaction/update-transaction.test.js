import { ZodError } from 'zod'
import { UpdateTransactionController } from './update-transaction'
import { faker } from '@faker-js/faker'

describe('UpdateTransactionController', () => {
    class UpdateTransactionUseCaseStub {
        async execute() {
            return {
                user_id: faker.string.uuid(),
                id: faker.string.uuid(),
                name: faker.commerce.productName(),
                date: faker.date.anytime().toISOString(),
                type: 'EARNING',
                amount: Number(faker.finance.amount()),
            }
        }
    }

    const makeSut = () => {
        const updateTransactionUseCase = new UpdateTransactionUseCaseStub()
        const sut = new UpdateTransactionController(updateTransactionUseCase)

        return {
            sut,
            updateTransactionUseCase,
        }
    }

    it('should return 200 when updating a transaction successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            params: {
                transactionId: faker.string.uuid(),
            },
            body: {
                name: faker.commerce.productName(),
                date: faker.date.anytime().toISOString(),
                type: 'EARNING',
                amount: Number(faker.finance.amount()),
            },
        })

        // assert
        expect(response.statusCode).toBe(200)
    })

    it('should return 400 if id is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            params: {
                transactionId: 'invalid_transactionId',
            },
            body: {
                name: faker.commerce.productName(),
                date: faker.date.anytime().toISOString(),
                type: 'EARNING',
                amount: Number(faker.finance.amount()),
            },
        })

        // assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 if some field is not allowed to update', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            params: {
                transactionId: faker.string.uuid(),
            },
            body: {
                name: faker.commerce.productName(),
                transactionId: faker.string.uuid(),
            },
        })

        // assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 if UpdateTransactionUseCase throws a ZodError', async () => {
        // arrange
        const { sut, updateTransactionUseCase } = makeSut()
        const zodError = new ZodError([
            {
                code: 'invalid_type',
                expected: 'string',
                received: 'number',
                path: ['date'],
                message: 'Expected string, received number',
            },
        ])
        jest.spyOn(updateTransactionUseCase, 'execute').mockRejectedValueOnce(
            zodError,
        )

        // act
        const response = await sut.execute({
            params: {
                transactionId: faker.string.uuid(),
            },
            body: {
                date: faker.number.bigInt(),
            },
        })

        // assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 500 when UpdateTransactionUseCase throws a server error', async () => {
        // arrange
        const { sut, updateTransactionUseCase } = makeSut()
        jest.spyOn(updateTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        // act
        const response = await sut.execute({
            params: {
                transactionId: faker.string.uuid(),
            },
            body: {
                name: faker.commerce.productName(),
                date: faker.date.anytime().toISOString(),
                type: 'EARNING',
                amount: Number(faker.finance.amount()),
            },
        })

        // assert
        expect(response.statusCode).toBe(500)
    })

    it('should call UpdateTransactionUseCase with correct params', async () => {
        // arrange
        const { sut, updateTransactionUseCase } = makeSut()

        const executeSpy = jest.spyOn(updateTransactionUseCase, 'execute')

        const transactionId = faker.string.uuid()
        const body = {
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            type: 'EARNING',
            amount: Number(faker.finance.amount()),
        }
        // act
        await sut.execute({
            params: {
                transactionId,
            },
            body,
        })

        // assert
        expect(executeSpy).toHaveBeenCalledWith(transactionId, body)
        expect(executeSpy).toHaveBeenCalledTimes(1)
    })
})
