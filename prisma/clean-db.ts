import 'dotenv/config'
import { Client } from 'pg'

// Check if DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL is not defined in environment variables')
  process.exit(1)
}

// Function to clean all data from database
// If client is provided, use it; otherwise create a new one
export async function cleanDatabase(client?: Client) {
  console.log('🧹 Cleaning database...')
  
  const shouldCloseClient = !client
  let dbClient = client
  
  if (!dbClient) {
    dbClient = new Client({
      connectionString: process.env.DATABASE_URL,
    })
    await dbClient.connect()
  }
  
  try {
    // Delete in order respecting foreign key constraints
    // Start with tables that have foreign keys, then parent tables
    
    await dbClient.query('DELETE FROM audit_logs')
    console.log('  ✓ audit_logs cleaned')
    
    await dbClient.query('DELETE FROM alerts')
    console.log('  ✓ alerts cleaned')
    
    await dbClient.query('DELETE FROM searches')
    console.log('  ✓ searches cleaned')
    
    await dbClient.query('DELETE FROM stocks')
    console.log('  ✓ stocks cleaned')
    
    await dbClient.query('DELETE FROM pharmacies')
    console.log('  ✓ pharmacies cleaned')
    
    await dbClient.query('DELETE FROM medications')
    console.log('  ✓ medications cleaned')
    
    await dbClient.query('DELETE FROM users')
    console.log('  ✓ users cleaned')
    
    console.log('✅ Database cleaned successfully!')
    console.log('')
  } catch (error) {
    console.error('❌ Error cleaning database:', error)
    throw error
  } finally {
    if (shouldCloseClient && dbClient) {
      await dbClient.end()
    }
  }
}

// If run directly, execute the clean function
if (require.main === module) {
  cleanDatabase()
    .then(() => {
      console.log('🎉 Database cleaning completed!')
      process.exit(0)
    })
    .catch((e) => {
      console.error('❌ Error:', e)
      process.exit(1)
    })
}

