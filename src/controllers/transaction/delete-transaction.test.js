import { DeleteTransactionController } from './delete-transaction'
import { faker } from '@faker-js/faker'

describe('DeleteTransactionController', () => {
    class DeleteTransactionUseCaseStub {
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
        const deleteTransactionUseCase = new DeleteTransactionUseCaseStub()
        const sut = new DeleteTransactionController(deleteTransactionUseCase)

        return { sut, deleteTransactionUseCase }
    }

    it('should return 200 when deleting a transaction successfully', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            params: {
                transactionId: faker.string.uuid(),
            },
        })

        expect(response.statusCode).toBe(200)
    })

    it('should return 400 when id is invalid', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            params: { transactionId: 'invalid_transactionId' },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 404 when transaction is not found', async () => {
        const { sut, deleteTransactionUseCase } = makeSut()

        // Mock the execute method to return null
        deleteTransactionUseCase.execute = jest.fn().mockResolvedValue(null)

        const response = await sut.execute({
            params: {
                transactionId: faker.string.uuid(),
            },
        })

        expect(response.statusCode).toBe(404)
    })

    it('should return 500 when DeleteTransactionUseCase throws', async () => {
        const { sut, deleteTransactionUseCase } = makeSut()

        // Mock the execute method to throw an error
        deleteTransactionUseCase.execute = jest
            .fn()
            .mockRejectedValue(new Error())

        const response = await sut.execute({
            params: {
                transactionId: faker.string.uuid(),
            },
        })

        expect(response.statusCode).toBe(500)
    })

    it('should call DeleteTransactionUseCase with correct params', async () => {
        const { sut, deleteTransactionUseCase } = makeSut()

        const executeSpy = jest.spyOn(deleteTransactionUseCase, 'execute')

        const transactionId = faker.string.uuid()

        // act
        await sut.execute({
            params: {
                transactionId,
            },
        })

        // assert
        expect(executeSpy).toHaveBeenCalledWith(transactionId)
        expect(executeSpy).toHaveBeenCalledTimes(1)
    })
})
