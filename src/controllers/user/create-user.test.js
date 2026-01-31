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
})
