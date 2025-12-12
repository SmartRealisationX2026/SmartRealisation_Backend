import 'dotenv/config'
import { execSync } from 'child_process'
import { cleanDatabase } from './clean-db'

async function main() {
  console.log('🔄 Running migration with database cleanup...')
  console.log('')

  try {
    // Clean database first
    await cleanDatabase()

    // Run Prisma migration
    console.log('📦 Running Prisma migration...')
    execSync('npx prisma migrate dev', { stdio: 'inherit' })

    console.log('')
    console.log('✅ Migration completed successfully!')
  } catch (error) {
    console.error('❌ Error during migration:', error)
    process.exit(1)
  }
}

main()

