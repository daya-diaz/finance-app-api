import z from 'zod'

export const createUserSchema = z.object({
    first_name: z
        .string()
        .trim()
        .min(1, { message: 'First name is required' })
        .min(2, { message: 'First name must be at least 2 characters long' }),

    last_name: z
        .string()
        .trim()
        .min(1, { message: 'Last name is required' })
        .min(2, { message: 'Last name must be at least 2 characters long' }),

    email: z
        .string()
        .trim()
        .min(1, { message: 'Email is required' })
        .email('Please provide a valid email'),

    password: z
        .string()
        .trim()
        .min(1, { message: 'Password is required' })
        .min(6, { message: 'Password must be at least 6 characters long' })
        .refine((value) => !/\s/.test(value), {
            message: 'Password cannot contain spaces',
        }),
})

export const updateUserSchema = createUserSchema.partial().strict({
    message: 'Some provided fields are not allowed to be updated.',
})
