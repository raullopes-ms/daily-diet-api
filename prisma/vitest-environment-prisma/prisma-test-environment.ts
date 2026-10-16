import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { Environment } from 'vitest/runtime'

/* 
Criação de um ambiente de banco de dados isolado 
para cada arquivo / suite de testes utilizando Vitest e o Prisma.
*/
function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  viteEnvironment: 'ssr',

  async setup() { // criar o banco de testes
    const schema = `test_${randomUUID().replace(/-/g, '')}`
    const databaseUrl = generateDatabaseUrl(schema)
    process.env.DATABASE_URL = databaseUrl
    console.log(databaseUrl)
    const adapter = new PrismaPg(
      { connectionString: databaseUrl },
      { schema },
    )
    const prisma = new PrismaClient({ adapter })
    try {
      execSync('npx prisma db push', {
        stdio: 'inherit',
        env: {
          ...process.env,
          DATABASE_URL: databaseUrl,
        },
      })
    } catch (error) {
      try {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )
      } finally {
        await prisma.$disconnect()
      }

      throw error
    }
    return {
      async teardown() { // Apagar o banco de testes
        try {
          await prisma.$executeRawUnsafe(
            `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
          )
        } finally {
          await prisma.$disconnect()
        }
      },
    }
  },
}
