import { UpdateUserUseCase } from '../use-cases/update-user.js'
import { badRequest, ok, serverError } from './helpers.js'
import validator from 'validator'
import { EmailAlreadyInUseError } from '../errors/user.js'

export class UpdateUserController {
    async execute(httpRequest) {
        try {
            const updateUserParams = httpRequest.body
            const userId = httpRequest.params.userId
            const isIdValid = validator.isUUID(userId)

            if (!isIdValid) {
                return badRequest({ message: 'Invalid user ID.' })
            }

            const allowedFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            const someFieldIsNoteAllowed = Object.keys(updateUserParams).some(
                (key) => !allowedFields.includes(key),
            )

            if (someFieldIsNoteAllowed) {
                return badRequest({
                    message: 'Some fields are not allowed to be updated.',
                })
            }

            if (updateUserParams.password) {
                const passwordIsNotValid = updateUserParams.password.length < 6

                if (passwordIsNotValid) {
                    return badRequest({
                        message: 'Password must be at least 6 characters long.',
                    })
                }
            }

            if (updateUserParams.email) {
                const emailIsValid = validator.isEmail(updateUserParams.email)

                if (!emailIsValid) {
                    return badRequest({ message: 'Invalid email format.' })
                }
            }

            const updateUserUseCase = new UpdateUserUseCase()

            const updatedUser = await updateUserUseCase.execute(
                userId,
                updateUserParams,
            )
            return ok(updatedUser)
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }

            console.error('Error creating user:', error)
            return serverError()
        }
    }
}
