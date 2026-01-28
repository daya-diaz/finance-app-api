import { ZodError } from 'zod'
import { updateTransactionSchema } from '../../schemas/transactions.js'
import {
    ok,
    badRequest,
    checkIfIdIsValid,
    invalidIdResponse,
    serverError,
} from '../helpers/index.js'

export class UpdateTransactionController {
    constructor(updateTransactionUseCase) {
        this.updateTransactionUseCase = updateTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const transactionId = httpRequest.params.transactionId
            const idIsValid = checkIfIdIsValid(transactionId)
            const params = httpRequest.body

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const allowedFields = ['name', 'date', 'amount', 'type']

            const someFieldIsNotAllowed = Object.keys(params).some(
                (key) => !allowedFields.includes(key),
            )

            if (someFieldIsNotAllowed) {
                return badRequest({
                    message: 'Some fields are not allowed to be updated.',
                })
            }

            await updateTransactionSchema.parseAsync(params)

            const updatedTransaction =
                await this.updateTransactionUseCase.execute(
                    transactionId,
                    params,
                )

            return ok(updatedTransaction)
        } catch (error) {
            if (error instanceof ZodError) {
                const firstIssue = error.issues[0]
                return badRequest({
                    message: firstIssue.message,
                })
            }
            console.log(error)
            return serverError()
        }
    }
}
