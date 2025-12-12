import { UpdateUserUseCase } from '../use-cases/update-user.js'
import { badRequest, ok, serverError } from './helpers/http.js'
import { EmailAlreadyInUseError } from '../errors/user.js'
import {
    invalidPasswordResponse,
    emailIsAlreadyInUseResponse,
    invalidIdResponse,
    checkIfEmailIsValid,
    checkIfPasswordIsValid,
    checkIfIdIsValid,
} from './helpers/user.js'

export class UpdateUserController {
    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            const userId = httpRequest.params.userId

            const isIdValid = checkIfIdIsValid(userId)

            if (!isIdValid) {
                return invalidIdResponse()
            }

            const allowedFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            const someFieldIsNoteAllowed = Object.keys(params).some(
                (key) => !allowedFields.includes(key),
            )

            if (someFieldIsNoteAllowed) {
                return badRequest({
                    message: 'Some fields are not allowed to be updated.',
                })
            }

            if (params.password) {
                const passwordIsNotValid = checkIfPasswordIsValid(
                    params.password,
                )

                if (passwordIsNotValid) {
                    return invalidPasswordResponse()
                }
            }

            if (params.email) {
                const emailIsValid = checkIfEmailIsValid(params.email)

                if (!emailIsValid) {
                    return emailIsAlreadyInUseResponse()
                }
            }

            const updateUserUseCase = new UpdateUserUseCase()

            const updatedUser = await updateUserUseCase.execute(userId, params)
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
