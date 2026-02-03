import { faker } from '@faker-js/faker'
import { CreateUserController } from './create-user'
import { EmailAlreadyInUseError } from '../../errors/user'

describe('CreateUserController', () => {
    class CreateUserUseCaseStub {
        async execute(user) {
            return user
        }
    }
    const makeSut = () => {
        const createUserUseCase = new CreateUserUseCaseStub()
        const sut = new CreateUserController(createUserUseCase)

        return { createUserUseCase, sut }
    }

    const httpRequest = {
        body: {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({
                length: 7,
            }),
        },
    }

    it('should return 201 when user is created successfuly', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(201)
        expect(result.body).toEqual(httpRequest.body)
        expect(result.body).not.toBeUndefined()
        expect(result.body).not.toBeNull()
    })

    it('should return 400 when first_name is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: { ...httpRequest, first_name: undefined },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when last_name is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: { ...httpRequest, last_name: undefined },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when email is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: { ...httpRequest, email: undefined },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when password is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: { ...httpRequest, password: undefined },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it("should return 400 if email's type is invalid", async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: { ...httpRequest, email: 'johndoe.com' },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: { ...httpRequest, password: '123' },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should call CreateUserUseCase with correct params', async () => {
        // arrange
        const { createUserUseCase, sut } = makeSut()

        const executeSpy = jest.spyOn(createUserUseCase, 'execute')

        // act
        await sut.execute(httpRequest)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
        expect(executeSpy).toHaveBeenCalledTimes(1)
    })

    it('should return 500 if createUserRepository throws', async () => {
        // arrange
        const { createUserUseCase, sut } = makeSut()

        // act
        jest.spyOn(createUserUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(500)
    })

    it('should return 400 if CreateUserUseCase throws EmailIsAlreadyInUse error', async () => {
        // arrange
        const { createUserUseCase, sut } = makeSut()

        // act
        jest.spyOn(createUserUseCase, 'execute').mockRejectedValueOnce(
            new EmailAlreadyInUseError(httpRequest.body.email),
        )
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
    })
})
