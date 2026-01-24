import validator from 'validator'
import { badRequest } from './http.js'

export const checkIfAmountIsValid = (amount) =>
    validator.isCurrency(amount.toString(), {
        digits_after_decimal: [2],
        decimal_separator: '.',
        allow_negatives: false,
    })

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
