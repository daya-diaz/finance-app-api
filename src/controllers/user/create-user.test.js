import { CreateUserController } from './create-user'

describe('CreateUserController', () => {
    class CreateUserUseCaseStub {
        execute(user) {
            return user
        }
    }

    it('should return 201 when user is created successfuly', async () => {
        // arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: 'John',
                last_name: 'Doe',
                email: 'johndoe@example.com',
                password: '123456',
            },
        }
        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(201)
        expect(result.body).not.toBeUndefined()
        expect(result.body).not.toBeNull()
        expect(result.body.first_name).toBe('John')
        expect(result.body.last_name).toBe('Doe')
        expect(result.body.email).toBe('johndoe@example.com')
        expect(result.body.password).toBe('123456')
    })

    it('should return 400 when first_name is not provided', async () => {
        // arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                last_name: 'Doe',
                email: 'johndoe@example.com',
                password: '123456',
            },
        }

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when last_name is not provided', async () => {
        // arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: 'John',
                email: 'johndoe@example.com',
                password: '123456',
            },
        }

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when email is not provided', async () => {
        // arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: 'John',
                last_name: 'Doe',
                password: '123456',
            },
        }

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when password is not provided', async () => {
        // arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: 'John',
                last_name: 'Doe',
                email: 'johndoe@example.com',
            },
        }

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
    })

    it("should return 400 if email's type is invalid", async () => {
        // arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: 'John',
                last_name: 'Doe',
                email: 'johndoe.com',
                password: '12345678',
            },
        }
        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is invalid', async () => {
        // arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: 'John',
                last_name: 'Doe',
                email: 'johndoe@example.com',
                password: '11',
            },
        }

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
    })
})
