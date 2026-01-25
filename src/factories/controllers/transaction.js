import {
    CreateTransactionController,
    GetTransactionsByUserIdController,
    UpdateTransactionController,
} from '../../controllers/index.js'
import {
    PostgresCreateTransactionRepository,
    PostgresGetTransactionsByUserIdRepository,
    PostgresGetUserByIdRepository,
    PostgresUpdateTransactionRepository,
} from '../../repositories/postgres/index.js'
import {
    CreateTransactionUseCase,
    GetTransactionsByUserIdUseCase,
    UpdateTransactionUseCase,
} from '../../use-cases/index.js'

export const makeCreateTransactionController = () => {
    const createTransactionRepository =
        new PostgresCreateTransactionRepository()
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const createTransactionUseCase = new CreateTransactionUseCase(
        getUserByIdRepository,
        createTransactionRepository,
    )
    const createTransactionController = new CreateTransactionController(
        createTransactionUseCase,
    )

    return createTransactionController
}

export const makeGetTransactionsByUserIdController = () => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const getTransactionsByUserIdRepository =
        new PostgresGetTransactionsByUserIdRepository()

    const getTransactionsByUserIdUseCase = new GetTransactionsByUserIdUseCase(
        getUserByIdRepository,
        getTransactionsByUserIdRepository,
    )

    const getTransactionsByUserIdController =
        new GetTransactionsByUserIdController(getTransactionsByUserIdUseCase)

    return getTransactionsByUserIdController
}

export const makeUpdateTransactionController = () => {
    const updateTransactionRepository =
        new PostgresUpdateTransactionRepository()

    const updateTransactionUseCase = new UpdateTransactionUseCase(
        updateTransactionRepository,
    )

    const updateTransactionController = new UpdateTransactionController(
        updateTransactionUseCase,
    )

    return updateTransactionController
}
