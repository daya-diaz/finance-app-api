import { DeleteUserUseCase } from '../use-cases/index.js'
import {
    badRequest,
    checkIfIdIsValid,
    ok,
    serverError,
} from './helpers/index.js'

export class DeleteUserController {
    async execute(req) {
        try {
            const userId = req.params.userId
            const idIsValid = checkIfIdIsValid(userId)

            if (!idIsValid) {
                return badRequest({ message: 'Invalid user ID.' })
            }

            const deleteUserUseCase = new DeleteUserUseCase()
            const deletedUser = await deleteUserUseCase.execute(userId)

            return ok(deletedUser)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
