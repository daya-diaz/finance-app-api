import { EmailAlreadyInUseError } from '../../errors/user.js'
import {
    invalidIdResponse,
    checkIfIdIsValid,
    badRequest,
    ok,
    serverError,
} from '../helpers/index.js'

import { updateUserSchema } from '../../schemas/user.js'

export class UpdateUserController {
    constructor(updateUserUseCase) {
        this.updateUserUseCase = updateUserUseCase
    }
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

            await updateUserSchema.parseAsync(params)

            const updatedUser = await this.updateUserUseCase.execute(
                userId,
                params,
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
