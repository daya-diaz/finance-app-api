import validator from 'validator'
import { badRequest, notFound } from './http.js'

export const checkIfAmountIsValid = (amount) => {
    if (typeof amount !== 'number') return false

    return validator.isCurrency(amount.toFixed(2), {
        digits_after_decimal: [2],
        decimal_separator: '.',
        allow_negatives: false,
    })
}

export const checkIfTypeIsValid = (type) =>
    ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(type)

export const invalidAmountResponse = () =>
    badRequest({
        message: 'The amount is invalid.',
    })

export const invalidTypeResponse = () =>
    badRequest({
        message:
            'The transaction type is invalid. It must be EARNING, EXPENSE or INVESTMENT.',
    })

export const transactionNotFoundResponse = () => {
    notFound({ message: 'Transaction not found.' })
}
