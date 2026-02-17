import { faker } from '@faker-js/faker'
import { GetUserByIdController } from './get-user-by-id'

describe('GetUserByIdController', () => {
    class GetUserByIdUseCaseStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 7,
                }),
            }
        }
    }

    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCaseStub()
        const sut = new GetUserByIdController(getUserByIdUseCase)

        return {
            getUserByIdUseCase,
            sut,
        }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    }

    it('should return 200 if gets user by id successfully', async () => {
        // arrange
        const { sut } = makeSut()
        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if userId is not valid', async () => {
        // arrange
        const { sut } = makeSut()
        // act
        const result = await sut.execute({
            params: { userId: 'invalid_user_id' },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if user is not found', async () => {
        // arrange
        const { sut, getUserByIdUseCase } = makeSut()

        // act
        jest.spyOn(getUserByIdUseCase, 'execute').mockResolvedValueOnce(null)

        const result = await sut.execute(httpRequest)
        // assert

        expect(result.statusCode).toBe(404)
    })

    it('should return 400 if GetUserByIdUseCase throws an error', async () => {
        // arrange
        const { sut, getUserByIdUseCase } = makeSut()

        // act
        jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe('Invalid user ID.')
    })

    it('should call GetUserByIdUseCase with correct params', async () => {
        // arrange
        const { getUserByIdUseCase, sut } = makeSut()

        const executeSpy = jest.spyOn(getUserByIdUseCase, 'execute')

        // act
        await sut.execute(httpRequest)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId)
        expect(executeSpy).toHaveBeenCalledTimes(1)
    })
})
