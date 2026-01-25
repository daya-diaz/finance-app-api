import {
    ok,
    badRequest,
    checkIfAmountIsValid,
    checkIfIdIsValid,
    checkIfTypeIsValid,
    invalidIdResponse,
    serverError,
} from '../helpers/index.js'
import validator from 'validator'

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

            if (params.amount) {
                const amountIsValid = checkIfAmountIsValid(params.amount)

                if (!amountIsValid) {
                    return badRequest({
                        message: 'Field amount is not valid.',
                    })
                }
            }

            if (params.name) {
                const nameIsValid = validator.isLength(params.name, { min: 3 })

                if (!nameIsValid) {
                    return badRequest({
                        message: 'Field name is not valid.',
                    })
                }
            }

            if (params.type) {
                const typeIsValid = checkIfTypeIsValid(params.type)

                if (!typeIsValid) {
                    return badRequest({
                        message: 'Field type is not valid.',
                    })
                }
            }

            if (params.date) {
                const dateIsValid = validator.isDate(params.date, {
                    format: 'YYYY-MM-DD',
                    strictMode: true,
                    delimiters: ['-', '/'],
                })

                if (!dateIsValid) {
                    return badRequest({
                        message: 'Field date is not valid.',
                    })
                }

                const transactionDate = new Date(params.date)
                const today = new Date()
                today.setHours(0, 0, 0, 0)

                if (transactionDate > today) {
                    return badRequest({
                        message: 'Date cannot be in the future.',
                    })
                }
            }

            const updatedTransaction =
                await this.updateTransactionUseCase.execute(
                    transactionId,
                    params,
                )

            return ok(updatedTransaction)
        } catch (error) {
            console.log(error)
            return serverError()
        }
    }
}
