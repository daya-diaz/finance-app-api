import { faker } from '@faker-js/faker'
import { GetUserByIdUseCase } from './get-user-by-id'

describe('GetUserByIdUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }
    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub()
        const sut = new GetUserByIdUseCase(getUserByIdRepositoryStub)

        return {
            sut,
            getUserByIdRepositoryStub,
        }
    }

    it('should return a user successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const userResult = await sut.execute(faker.string.uuid())

        // assert
        expect(userResult).toBeTruthy()
        expect(userResult).toEqual(user)
    })
})
