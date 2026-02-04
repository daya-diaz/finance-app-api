import { UpdateUserController } from './update-user'
import { faker } from '@faker-js/faker'

describe('UpdateUserController', () => {
    class UpdateUserUseCaseStub {
        async execute(user) {
            return user
        }
    }

    const makeSut = () => {
        const updateUserUseCase = new UpdateUserUseCaseStub()
        const sut = new UpdateUserController(updateUserUseCase)

        return { sut, updateUserUseCase }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
        body: {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({
                length: 7,
            }),
        },
    }

    it('should return 200 when updating a user successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 when an invalid email is provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest,
                email: 'invalid_email',
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when an invalid password is provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest,
                password: '123',
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when an invalid userId param is provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            params: { userId: 'invalid_userId' },
            body: httpRequest.body,
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when an unallowed field is provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            params: httpRequest.params,
            body: { ...httpRequest.body, unallowed_field: 'unallowed_field' },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 500 if UpdateUserUseCase throws a generic error', async () => {
        // arrange
        const { sut, updateUserUseCase } = makeSut()
        jest.spyOn(updateUserUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(500)
    })
})
