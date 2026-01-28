import z from 'zod'
import validator from 'validator'

export const createTransactionSchema = z.object({
    user_id: z.uuid({
        message: 'User ID must be a valid UUID',
    }),
    name: z
        .string({ required_error: 'Name is required' })
        .trim()
        .min(2, { message: 'Name must be at least 2 characters long' }),

    date: z.iso.datetime({
        required_error: 'Date is required',
        message: 'Date is required and must be a valid date',
    }),

    type: z.enum(['EARNING', 'EXPENSE', 'INVESTMENT'], {
        errorMap: () => ({
            message: 'Type must be EARNING, EXPENSE or INVESTMENT',
        }),
    }),

    amount: z
        .number({
            required_error: 'Amount is required',
            message: 'Amount must be a number',
        })
        .min(1, { message: 'Amount must be greater than 0' })
        .refine((value) =>
            validator.isCurrency(value.toFixed(2), {
                digits_after_decimal: [2],
                decimal_separator: '.',
                allow_negatives: false,
            }),
        ),
})
