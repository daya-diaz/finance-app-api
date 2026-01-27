import { badRequest, notFound } from './http.js'

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

export const userNotFoundResponse = () => {
    notFound({ message: 'User not found.' })
}
