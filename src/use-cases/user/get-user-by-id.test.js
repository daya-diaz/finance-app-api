import { faker } from '@faker-js/faker'
import { GetUserByIdUseCase } from './get-user-by-id'
import { UserNotFoundError } from '../../errors/user'

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
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetUserByIdUseCase(getUserByIdRepository)

        return {
            sut,
            getUserByIdRepository,
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

    it('should throws a UserNotFoundError when user is not found', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValue(null)
        const userId = faker.string.uuid()

        // act
        const promise = sut.execute(userId)

        // assert
        await expect(promise).rejects.toThrow(new UserNotFoundError(userId))
    })

    it('should call GetUserByIdRepository with correct values', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        const userId = faker.string.uuid()
        const getUserByIdRepositorySpy = jest.spyOn(
            getUserByIdRepository,
            'execute',
        )

        // act
        await sut.execute(userId)

        // assert
        expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(userId)
    })
})
