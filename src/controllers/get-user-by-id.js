import { PostgresGetUserByIdRepository } from '../repositories/postgres/postgres-get-user-by-id-repository.js'
export class GetUserByIdController {
    async execute(httpResponse) {
        const getUserByIdRepository = new PostgresGetUserByIdRepository()

        const user = await getUserByIdRepository.execute(httpResponse.params.id)

        return user
    }
}
