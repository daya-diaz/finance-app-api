import { faker } from '@faker-js/faker'
import { DeleteUserUseCase } from './delete-user'

describe('DeleteUserUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }

    class DeleteUserRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const deleteUserRepositoryStub = new DeleteUserRepositoryStub()
        const sut = new DeleteUserUseCase(deleteUserRepositoryStub)
        return {
            sut,
            deleteUserRepositoryStub,
        }
    }

    it('should successfully delete the user', async () => {
        const { sut } = makeSut()

        const deletedUser = await sut.execute(faker.string.uuid())

        expect(deletedUser).toEqual(user)
    })
})
