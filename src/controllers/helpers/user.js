import { badRequest } from '../helpers/http.js'
import validator from 'validator'
export const invalidPasswordResponse = () => {
    return badRequest({
        message: 'Password must be at least 6 characters long.',
    })
}

export const emailIsAlreadyInUseResponse = () => {
    return badRequest({
        message: 'Email is already in use.',
    })
}

export const invalidIdResponse = () => {
    return badRequest({
        message: 'The provided ID is invalid.',
    })
}

export const checkIfPasswordIsValid = (password) =>
    validator.isLength(password, {
        min: 6,
    })
export const checkIfEmailIsValid = (email) => validator.isEmail(email)

export const checkIfIdIsValid = (id) => validator.isUUID(id)
