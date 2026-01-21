import 'dotenv/config.js'
import express from 'express'

import { PostgresHelper } from './src/db/postgres/helper.js'
import {
    CreateUserController,
    DeleteUserController,
    GetUserByIdController,
    UpdateUserController,
} from './src/controllers/index.js'
import {
    GetUserByIdUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
} from './src/use-cases/index.js'
import {
    PostgresGetUserByIdRepository,
    PostgresGetUserByEmailRepository,
    PostgresDeleteUserRepository,
    PostgresCreateUserRepository,
    PostgresUpdateUserRepository,
} from './src/repositories/postgres/index.js'

const app = express()

app.use(express.json())

app.get('/api/users', async (req, res) => {
    const results = await PostgresHelper.query('SELECT * FROM users;')

    res.send(JSON.stringify(results))
})

app.post('/api/users', async (req, res) => {
    const createUserUseCase = new CreateUserUseCase(
        new PostgresGetUserByEmailRepository(),
        new PostgresCreateUserRepository(),
    )

    const createUserController = new CreateUserController(createUserUseCase)

    const { statusCode, body } = await createUserController.execute(req)

    res.status(statusCode).json(body)
})

app.get('/api/users/:userId', async (req, res) => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)

    const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

    const { statusCode, body } = await getUserByIdController.execute(req)

    res.status(statusCode).send(body)
})

app.patch('/api/users/:userId', async (req, res) => {
    const updateUserUseCase = new UpdateUserUseCase(
        new PostgresGetUserByEmailRepository(),
        new PostgresUpdateUserRepository(),
    )
    const updateUserController = new UpdateUserController(updateUserUseCase)
    const { statusCode, body } = await updateUserController.execute(req)

    res.status(statusCode).json(body)
})

app.delete('/api/users/:userId', async (req, res) => {
    const deleteUserUseCase = new DeleteUserUseCase(
        new PostgresDeleteUserRepository(),
    )
    const deleteUserController = new DeleteUserController(deleteUserUseCase)

    const { statusCode, body } = await deleteUserController.execute(req)

    res.status(statusCode).json(body)
})

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}...`)
})
