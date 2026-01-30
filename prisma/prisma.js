import { PrismaClient } from '@prisma/client'

// Essa instância será usada em todo o seu app
const prisma = new PrismaClient()

export default prisma
