import 'dotenv/config.js'
import express from 'express'

import { PostgresHelper } from './src/db/postgres/helper.js'
import {
    makeCreateUserController,
    makeDeleteUserController,
    makeGetUserByIdController,
    makeUpdateUserController,
} from './src/factories/controllers/user.js'
import {
    makeCreateTransactionController,
    makeGetTransactionsByUserIdController,
    makeUpdateTransactionController,
} from './src/factories/controllers/transaction.js'

const app = express()

app.use(express.json())

app.get('/api/users', async (_req, res) => {
    const results = await PostgresHelper.query('SELECT * FROM users;')

    res.send(JSON.stringify(results))
})

app.post('/api/users', async (req, res) => {
    const createUserController = makeCreateUserController()
    const { statusCode, body } = await createUserController.execute(req)

    res.status(statusCode).json(body)
})

app.get('/api/users/:userId', async (req, res) => {
    const getUserByIdController = makeGetUserByIdController()
    const { statusCode, body } = await getUserByIdController.execute(req)

    res.status(statusCode).send(body)
})

app.patch('/api/users/:userId', async (req, res) => {
    const updateUserController = makeUpdateUserController()
    const { statusCode, body } = await updateUserController.execute(req)

    res.status(statusCode).json(body)
})

app.delete('/api/users/:userId', async (req, res) => {
    const deleteUserController = makeDeleteUserController()

    const { statusCode, body } = await deleteUserController.execute(req)

    res.status(statusCode).json(body)
})

app.get('/api/transactions', async (req, res) => {
    const getTransactionsByUserIdController =
        makeGetTransactionsByUserIdController()
    const { statusCode, body } =
        await getTransactionsByUserIdController.execute(req)

    res.status(statusCode).send(body)
})

app.post('/api/transactions', async (req, res) => {
    const createTransactionController = makeCreateTransactionController()

    const { statusCode, body } = await createTransactionController.execute(req)

    res.status(statusCode).send(body)
})

app.patch('/api/transactions/:transactionId', async (req, res) => {
    const updateTransactionController = makeUpdateTransactionController()
    const { statusCode, body } = await updateTransactionController.execute(req)

    res.status(statusCode).send(body)
})

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}...`)
})
