import { faker } from '@faker-js/faker'
import { UpdateUserUseCase } from './update-user'
import { EmailAlreadyInUseError } from '../../errors/user'

describe('UpdateUserUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }
    class GetUserByEmailRepositoryStub {
        async execute() {
            return null
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'HASHED_PASSWORD'
        }
    }

    class UpdateUserRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const updateUserRepository = new UpdateUserRepositoryStub()
        const passwordHasherAdapter = new PasswordHasherAdapterStub()

        const sut = new UpdateUserUseCase(
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
        )

        return {
            sut,
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
        }
    }

    it('should update user successfully (without email and password)', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(faker.string.uuid(), {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
        })

        // assert
        expect(result).toBe(user)
    })

    it('should update user successfully passing email', async () => {
        // arrange
        const { sut, getUserByEmailRepository } = makeSut()
        const getUserByEmailRepositorySpy = jest.spyOn(
            getUserByEmailRepository,
            'execute',
        )
        const email = faker.internet.email()

        // act
        const result = await sut.execute(faker.string.uuid(), {
            email,
        })

        // assert
        expect(getUserByEmailRepositorySpy).toHaveBeenCalledWith(email)
        expect(result).toBe(user)
    })

    it('should update user successfully passing password', async () => {
        // arrange
        const { sut, passwordHasherAdapter } = makeSut()
        const passwordHasherAdapterSpy = jest.spyOn(
            passwordHasherAdapter,
            'execute',
        )
        const password = faker.internet.password({
            length: 7,
        })
        // act
        const result = await sut.execute(faker.string.uuid(), {
            password,
        })

        // assert
        expect(passwordHasherAdapterSpy).toHaveBeenCalledWith(password)
        expect(result).toBe(user)
    })

    it('should throw an EmailAlreadyInUseError when the provided email is already in use', async () => {
        // arrange
        const { sut, getUserByEmailRepository } = makeSut()
        const email = faker.internet.email()
        jest.spyOn(getUserByEmailRepository, 'execute').mockResolvedValueOnce(
            email,
        )

        // act
        const promise = sut.execute(faker.string.uuid(), {
            email,
        })

        // assert
        await expect(promise).rejects.toThrow(new EmailAlreadyInUseError(email))
    })

    it('should call UpdateUserRepository with correct params', async () => {
        const { sut, updateUserRepository } = makeSut()
        const updateUserRepositorySpy = jest.spyOn(
            updateUserRepository,
            'execute',
        )
        const updateUserParams = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
        }
        await sut.execute(user.id, updateUserParams)

        expect(updateUserRepositorySpy).toHaveBeenCalledWith(user.id, {
            ...updateUserParams,
            password: 'HASHED_PASSWORD',
        })
    })

    it('should throw if GetUserByEmailRepository throws', async () => {
        // arrange
        const { sut, getUserByEmailRepository } = makeSut()
        jest.spyOn(getUserByEmailRepository, 'execute').mockRejectedValue(
            new Error(),
        )

        // act
        const promise = sut.execute(faker.string.uuid(), {
            email: faker.internet.email(),
        })

        // assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw if PasswordHasherAdapter throws', async () => {
        // arrange
        const { sut, passwordHasherAdapter } = makeSut()
        jest.spyOn(passwordHasherAdapter, 'execute').mockRejectedValue(
            new Error(),
        )

        // act
        const promise = sut.execute(faker.string.uuid(), {
            password: faker.internet.password(),
        })

        // assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw if UpdateUserRepository throws', async () => {
        // arrange
        const { sut, updateUserRepository } = makeSut()
        jest.spyOn(updateUserRepository, 'execute').mockRejectedValue(
            new Error(),
        )

        // act
        const promise = sut.execute(faker.string.uuid(), { ...user, id: null })

        // assert
        await expect(promise).rejects.toThrow()
    })
})
