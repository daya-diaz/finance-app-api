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
            const idIsValid = checkIfIdIsValid(httpRequest.params.transactionId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const params = httpRequest.body

            await updateTransactionSchema.parseAsync(params)

            const transaction = await this.updateTransactionUseCase.execute(
                httpRequest.params.transactionId,
                params,
            )

            return ok(transaction)
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
