import 'dotenv/config'
import * as bcrypt from 'bcrypt'
import { Client } from 'pg'
import { faker } from '@faker-js/faker'
import { cleanDatabase } from './clean-db'

// Check if DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL is not defined in environment variables')
  console.error('Please create a .env file with: DATABASE_URL="postgresql://username:password@localhost:5432/dbname"')
  process.exit(1)
}

// Use direct PostgreSQL client to seed data
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 30000, // 30 seconds
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000, // 10 seconds
})

// Helper function to ensure connection is active
async function ensureConnection() {
  try {
    // Simple ping query to check if connection is alive
    await client.query('SELECT 1')
  } catch (error: any) {
    if (error.code === '57P01' || error.message?.includes('Connection terminated') || error.message?.includes('ended')) {
      console.log('⚠️  Connection lost, reconnecting...')
      try {
        await client.end()
      } catch {
        // Ignore errors when ending
      }
      await client.connect()
    } else {
      throw error
    }
  }
}

// Helper functions to generate fake data
function generateCameroonPhone(): string {
  return `+237${faker.string.numeric(9)}`
}

function generateCameroonLocation(): { latitude: number; longitude: number } {
  // Cameroon coordinates ranges
  // Latitude: 1.65 to 13.08
  // Longitude: 8.49 to 16.19
  return {
    latitude: parseFloat(faker.location.latitude({ min: 1.65, max: 13.08 }).toFixed(8)),
    longitude: parseFloat(faker.location.longitude({ min: 8.49, max: 16.19 }).toFixed(8))
  }
}

function generateCameroonCity(): string {
  const cities = ['Douala', 'Yaoundé', 'Bafoussam', 'Bamenda', 'Garoua', 'Maroua', 'Buea', 'Limbe', 'Kribi', 'Ebolowa']
  return faker.helpers.arrayElement(cities)
}

function generateMedicationForm(): string {
  const forms = ['Comprimé', 'Gélule', 'Sirop', 'Injection', 'Pommade', 'Gouttes', 'Suppositoire', 'Spray']
  return faker.helpers.arrayElement(forms)
}

function generateMedicationCategory(): string {
  const categories = [
    'Antalgique', 'Antibiotique', 'Anti-inflammatoire', 'Vitamine', 'Antiulcéreux',
    'Antihistaminique', 'Antitussif', 'Antidiabétique', 'Cardiovasculaire', 'Dermatologique'
  ]
  return faker.helpers.arrayElement(categories)
}

function generateDosage(): string {
  const dosages = ['250mg', '500mg', '1000mg', '20mg', '40mg', '10ml', '20ml', '5ml', '1g', '2g']
  return faker.helpers.arrayElement(dosages)
}

async function main() {
  console.log('🌱 Seeding database with original data + Faker.js...')
  console.log('')

  await client.connect()

  // Clean database before seeding
  await cleanDatabase(client)

  // Hash password for users
  const hashedPassword = await bcrypt.hash('password123', 10)

  try {
    // ============================================
    // ORIGINAL DATA (keeping your existing data)
    // ============================================
    console.log('📝 Creating original data...')

    // Create admin user
    const adminResult = await client.query(`
      INSERT INTO users (id, email, password, role, name, phone, language, "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), 'admin@medilink.cm', $1, 'ADMIN', 'Admin MediLink', '+237690000000', 'FR', NOW(), NOW())
      RETURNING id
    `, [hashedPassword])
    const adminId = adminResult.rows[0].id
    console.log('✅ Admin user created')

    // Create pharmacist users
    const pharmacist1Result = await client.query(`
      INSERT INTO users (id, email, password, role, name, phone, language, "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), 'pharmacist1@medilink.cm', $1, 'PHARMACIST', 'Jean Dupont', '+237691111111', 'FR', NOW(), NOW())
      RETURNING id
    `, [hashedPassword])
    const pharmacist1Id = pharmacist1Result.rows[0].id

    const pharmacist2Result = await client.query(`
      INSERT INTO users (id, email, password, role, name, phone, language, "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), 'pharmacist2@medilink.cm', $1, 'PHARMACIST', 'Marie Martin', '+237692222222', 'FR', NOW(), NOW())
      RETURNING id
    `, [hashedPassword])
    const pharmacist2Id = pharmacist2Result.rows[0].id

    const pharmacist3Result = await client.query(`
      INSERT INTO users (id, email, password, role, name, phone, language, "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), 'pharmacist3@medilink.cm', $1, 'PHARMACIST', 'Pierre Kouam', '+237695555555', 'FR', NOW(), NOW())
      RETURNING id
    `, [hashedPassword])
    const pharmacist3Id = pharmacist3Result.rows[0].id
    const originalPharmacistIds = [pharmacist1Id, pharmacist2Id, pharmacist3Id]
    console.log('✅ Original pharmacist users created')

    // Create patient users
    const patient1Result = await client.query(`
      INSERT INTO users (id, email, password, role, name, phone, location, language, "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), 'patient1@medilink.cm', $1, 'PATIENT', 'Alice Johnson', '+237693333333',
              '{"latitude": 4.051056, "longitude": 9.767869}', 'FR', NOW(), NOW())
      RETURNING id
    `, [hashedPassword])
    const patient1Id = patient1Result.rows[0].id

    const patient2Result = await client.query(`
      INSERT INTO users (id, email, password, role, name, phone, location, language, "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), 'patient2@medilink.cm', $1, 'PATIENT', 'Bob Wilson', '+237694444444',
              '{"latitude": 3.866667, "longitude": 11.516667}', 'EN', NOW(), NOW())
      RETURNING id
    `, [hashedPassword])
    const patient2Id = patient2Result.rows[0].id
    const originalPatientIds = [patient1Id, patient2Id]
    console.log('✅ Original patient users created')

    // Create pharmacies
    const pharmacy1Result = await client.query(`
      INSERT INTO pharmacies (id, name, address, city, neighborhood, latitude, longitude, phone, "is_24_7", "owner_id", "is_approved", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), 'Pharmacie Centrale de Douala', 'Rue de la République, Bonanjo', 'Douala', 'Bonanjo',
              4.051056, 9.767869, '+237233000000', true, $1, true, NOW(), NOW())
      RETURNING id
    `, [pharmacist1Id])
    const pharmacy1Id = pharmacy1Result.rows[0].id

    const pharmacy2Result = await client.query(`
      INSERT INTO pharmacies (id, name, address, city, neighborhood, latitude, longitude, phone, "is_24_7", "owner_id", "is_approved", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), 'Pharmacie du Plateau', 'Avenue Kennedy, Plateau', 'Yaoundé', 'Plateau',
              3.866667, 11.516667, '+237222000000', false, $1, true, NOW(), NOW())
      RETURNING id
    `, [pharmacist2Id])
    const pharmacy2Id = pharmacy2Result.rows[0].id

    const pharmacy3Result = await client.query(`
      INSERT INTO pharmacies (id, name, address, city, neighborhood, latitude, longitude, phone, "is_24_7", "owner_id", "is_approved", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), 'Pharmacie Familiale', 'Quartier Bastos', 'Yaoundé', 'Bastos',
              3.868986, 11.523909, '+237222111111', false, $1, false, NOW(), NOW())
      RETURNING id
    `, [pharmacist3Id])
    const pharmacy3Id = pharmacy3Result.rows[0].id
    const originalPharmacyIds = [pharmacy1Id, pharmacy2Id, pharmacy3Id]
    console.log('✅ Original pharmacies created')

    // Create medications
    const medications: string[] = []
    const medsData = [
      ['Paracétamol', 'Paracetamol', 'Comprimé', '500mg', 'Antalgique'],
      ['Amoxicilline', 'Amoxicillin', 'Gélule', '500mg', 'Antibiotique'],
      ['Ibuprofène', 'Ibuprofen', 'Comprimé', '400mg', 'Anti-inflammatoire'],
      ['Vitamine C', 'Ascorbic Acid', 'Comprimé', '500mg', 'Vitamine'],
      ['Oméprazole', 'Omeprazole', 'Gélule', '20mg', 'Antiulcéreux']
    ]

    for (const [name, dci, form, dosage, category] of medsData) {
      const result = await client.query(`
        INSERT INTO medications (id, name, dci, form, dosage, category, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING id
      `, [name, dci, form, dosage, category])
      medications.push(result.rows[0].id)
    }
    const originalMedicationIds = [...medications]
    console.log('✅ Original medications created')

    // Create stocks
    const stocksData = [
      [pharmacy1Id, medications[0], 150, 150.00, false], // Paracetamol
      [pharmacy1Id, medications[1], 75, 2500.00, false], // Amoxicilline
      [pharmacy1Id, medications[2], 0, 200.00, true],   // Ibuprofen (out of stock)
      [pharmacy2Id, medications[0], 200, 140.00, false], // Paracetamol
      [pharmacy2Id, medications[3], 50, 300.00, false],  // Vitamine C
      [pharmacy3Id, medications[4], 25, 1500.00, false]  // Omeprazole
    ]

    for (const [pharmacyId, medicationId, quantity, price, isOutOfStock] of stocksData) {
      await client.query(`
        INSERT INTO stocks (id, "pharmacy_id", "medication_id", quantity, "price_fcfa", "last_updated", "is_out_of_stock", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), $5, NOW(), NOW())
      `, [pharmacyId, medicationId, quantity, price, isOutOfStock])
    }
    console.log('✅ Original stocks created')

    // Create searches
    await client.query(`
      INSERT INTO searches (id, "user_id", "medication_id", latitude, longitude, "results_count", "createdAt")
      VALUES (gen_random_uuid(), $1, $2, 4.051056, 9.767869, 2, NOW())
    `, [patient1Id, medications[0]]) // Authenticated search with GPS

    await client.query(`
      INSERT INTO searches (id, "medication_id", latitude, longitude, "results_count", "createdAt")
      VALUES (gen_random_uuid(), $1, 3.866667, 11.516667, 1, NOW())
    `, [medications[1]]) // Anonymous search with GPS
    console.log('✅ Original searches created')

    // Create alerts
    await client.query(`
      INSERT INTO alerts (id, "user_id", "medication_id", "pharmacy_id", "contact_info", status, "createdAt")
      VALUES (gen_random_uuid(), $1, $2, $3, $4, 'PENDING', NOW())
    `, [patient1Id, medications[2], pharmacy1Id, 'patient1@medilink.cm']) // User alert

    await client.query(`
      INSERT INTO alerts (id, "medication_id", "contact_info", status, "createdAt")
      VALUES (gen_random_uuid(), $1, '+237695555555', 'PENDING', NOW())
    `, [medications[1]]) // Anonymous alert
    console.log('✅ Original alerts created')

    // Create audit logs
    await client.query(`
      INSERT INTO audit_logs (id, "user_id", action, details, "createdAt")
      VALUES (gen_random_uuid(), $1, 'LOGIN', '{"ip": "127.0.0.1", "userAgent": "seed-script"}', NOW())
    `, [adminId])
    console.log('✅ Original audit logs created')

    // ============================================
    // FAKER.JS DATA (additional fake data)
    // ============================================
    console.log('')
    console.log('🎲 Creating additional data with Faker.js...')

    // Create additional pharmacist users (10 more)
    const newPharmacistIds: string[] = []
    for (let i = 0; i < 10; i++) {
      const result = await client.query(`
        INSERT INTO users (id, email, password, role, name, phone, language, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, 'PHARMACIST', $3, $4, $5, NOW(), NOW())
        RETURNING id
      `, [
        faker.internet.email({ firstName: faker.person.firstName(), lastName: faker.person.lastName() }),
        hashedPassword,
        faker.person.fullName(),
        generateCameroonPhone(),
        faker.helpers.arrayElement(['FR', 'EN'])
      ])
      newPharmacistIds.push(result.rows[0].id)
    }
    const pharmacistIds: string[] = [...originalPharmacistIds, ...newPharmacistIds]
    console.log(`✅ ${10} additional pharmacist users created`)

    // Create additional patient users (50 more)
    const patientIds: string[] = [...originalPatientIds]
    for (let i = 0; i < 50; i++) {
      const location = generateCameroonLocation()
      const result = await client.query(`
        INSERT INTO users (id, email, password, role, name, phone, location, language, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, 'PATIENT', $3, $4, $5, $6, NOW(), NOW())
        RETURNING id
      `, [
        faker.internet.email({ firstName: faker.person.firstName(), lastName: faker.person.lastName() }),
        hashedPassword,
        faker.person.fullName(),
        generateCameroonPhone(),
        JSON.stringify(location),
        faker.helpers.arrayElement(['FR', 'EN'])
      ])
      patientIds.push(result.rows[0].id)
    }
    console.log(`✅ ${50} additional patient users created`)

    // Create additional pharmacies (one per new pharmacist only)
    const pharmacyIds: string[] = [...originalPharmacyIds]
    for (const pharmacistId of newPharmacistIds) {
      const city = generateCameroonCity()
      const location = generateCameroonLocation()
      const result = await client.query(`
        INSERT INTO pharmacies (id, name, address, city, neighborhood, latitude, longitude, phone, "is_24_7", "owner_id", "is_approved", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
        RETURNING id
      `, [
        `Pharmacie ${faker.company.name()}`,
        faker.location.streetAddress(),
        city,
        faker.location.secondaryAddress(),
        location.latitude,
        location.longitude,
        generateCameroonPhone(),
        faker.datatype.boolean(),
        pharmacistId,
        faker.datatype.boolean({ probability: 0.8 }) // 80% approved
      ])
      pharmacyIds.push(result.rows[0].id)
    }
    console.log(`✅ ${newPharmacistIds.length} additional pharmacies created`)

    // Create additional medications (30 more)
    const medicationIds: string[] = [...originalMedicationIds]
    for (let i = 0; i < 30; i++) {
      const form = generateMedicationForm()
      const category = generateMedicationCategory()
      const result = await client.query(`
        INSERT INTO medications (id, name, dci, form, dosage, category, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING id
      `, [
        faker.commerce.productName(),
        faker.word.noun() + ' ' + faker.word.noun(), // DCI générique
        form,
        generateDosage(),
        category
      ])
      medicationIds.push(result.rows[0].id)
    }
    console.log(`✅ ${30} additional medications created`)

    // Create additional stocks (random stocks for each pharmacy)
    let additionalStockCount = 0
    for (const pharmacyId of pharmacyIds) {
      // Ensure connection is still active before processing each pharmacy
      await ensureConnection()
      
      // Each pharmacy has 5-15 different medications in stock
      const numMedications = faker.number.int({ min: 5, max: 15 })
      const selectedMedications = faker.helpers.arrayElements(medicationIds, numMedications)
      
      for (const medicationId of selectedMedications) {
        try {
          // Check if stock already exists (for original pharmacies with original medications)
          const existingStock = await client.query(`
            SELECT id FROM stocks WHERE "pharmacy_id" = $1 AND "medication_id" = $2
          `, [pharmacyId, medicationId])
          
          if (existingStock.rows.length === 0) {
            const quantity = faker.number.int({ min: 0, max: 500 })
            const isOutOfStock = quantity === 0
            const price = parseFloat(faker.commerce.price({ min: 100, max: 10000, dec: 2 }))
            
            await client.query(`
              INSERT INTO stocks (id, "pharmacy_id", "medication_id", quantity, "price_fcfa", "last_updated", "is_out_of_stock", "createdAt", "updatedAt")
              VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), $5, NOW(), NOW())
            `, [pharmacyId, medicationId, quantity, price, isOutOfStock])
            additionalStockCount++
          }
        } catch (error: any) {
          if (error.code === '57P01' || error.message?.includes('Connection terminated')) {
            console.log('⚠️  Connection lost during stock creation, reconnecting...')
            await ensureConnection()
            // Retry the operation
            const quantity = faker.number.int({ min: 0, max: 500 })
            const isOutOfStock = quantity === 0
            const price = parseFloat(faker.commerce.price({ min: 100, max: 10000, dec: 2 }))
            await client.query(`
              INSERT INTO stocks (id, "pharmacy_id", "medication_id", quantity, "price_fcfa", "last_updated", "is_out_of_stock", "createdAt", "updatedAt")
              VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), $5, NOW(), NOW())
            `, [pharmacyId, medicationId, quantity, price, isOutOfStock])
            additionalStockCount++
          } else {
            throw error
          }
        }
      }
    }
    console.log(`✅ ${additionalStockCount} additional stock entries created`)

    // Create additional searches (100 more)
    for (let i = 0; i < 100; i++) {
      // Check connection every 20 searches
      if (i % 20 === 0) {
        await ensureConnection()
      }
      
      const location = generateCameroonLocation()
      const hasUser = faker.datatype.boolean({ probability: 0.7 }) // 70% authenticated searches
      const userId = hasUser ? faker.helpers.arrayElement(patientIds) : null
      const medicationId = faker.helpers.arrayElement(medicationIds)
      const resultsCount = faker.number.int({ min: 0, max: 10 })

      try {
        if (userId) {
          await client.query(`
            INSERT INTO searches (id, "user_id", "medication_id", latitude, longitude, "results_count", "createdAt")
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())
          `, [userId, medicationId, location.latitude, location.longitude, resultsCount])
        } else {
          await client.query(`
            INSERT INTO searches (id, "medication_id", latitude, longitude, "results_count", "createdAt")
            VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
          `, [medicationId, location.latitude, location.longitude, resultsCount])
        }
      } catch (error: any) {
        if (error.code === '57P01' || error.message?.includes('Connection terminated')) {
          await ensureConnection()
          // Retry
          if (userId) {
            await client.query(`
              INSERT INTO searches (id, "user_id", "medication_id", latitude, longitude, "results_count", "createdAt")
              VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())
            `, [userId, medicationId, location.latitude, location.longitude, resultsCount])
          } else {
            await client.query(`
              INSERT INTO searches (id, "medication_id", latitude, longitude, "results_count", "createdAt")
              VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
            `, [medicationId, location.latitude, location.longitude, resultsCount])
          }
        } else {
          throw error
        }
      }
    }
    console.log('✅ 100 additional searches created')

    // Create additional alerts (50 more)
    for (let i = 0; i < 50; i++) {
      // Check connection every 25 alerts
      if (i % 25 === 0) {
        await ensureConnection()
      }
      
      const hasUser = faker.datatype.boolean({ probability: 0.6 }) // 60% user alerts
      const userId = hasUser ? faker.helpers.arrayElement(patientIds) : null
      const medicationId = faker.helpers.arrayElement(medicationIds)
      const hasPharmacy = faker.datatype.boolean({ probability: 0.5 })
      const pharmacyId = hasPharmacy ? faker.helpers.arrayElement(pharmacyIds) : null
      const contactInfo = hasUser 
        ? faker.internet.email() 
        : generateCameroonPhone()
      const status = faker.helpers.arrayElement(['PENDING', 'SENT'])

      try {
        if (userId && pharmacyId) {
          await client.query(`
            INSERT INTO alerts (id, "user_id", "medication_id", "pharmacy_id", "contact_info", status, "createdAt")
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())
          `, [userId, medicationId, pharmacyId, contactInfo, status])
        } else if (userId) {
          await client.query(`
            INSERT INTO alerts (id, "user_id", "medication_id", "contact_info", status, "createdAt")
            VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
          `, [userId, medicationId, contactInfo, status])
        } else {
          await client.query(`
            INSERT INTO alerts (id, "medication_id", "contact_info", status, "createdAt")
            VALUES (gen_random_uuid(), $1, $2, $3, NOW())
          `, [medicationId, contactInfo, status])
        }
      } catch (error: any) {
        if (error.code === '57P01' || error.message?.includes('Connection terminated')) {
          await ensureConnection()
          // Retry
          if (userId && pharmacyId) {
            await client.query(`
              INSERT INTO alerts (id, "user_id", "medication_id", "pharmacy_id", "contact_info", status, "createdAt")
              VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())
            `, [userId, medicationId, pharmacyId, contactInfo, status])
          } else if (userId) {
            await client.query(`
              INSERT INTO alerts (id, "user_id", "medication_id", "contact_info", status, "createdAt")
              VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
            `, [userId, medicationId, contactInfo, status])
          } else {
            await client.query(`
              INSERT INTO alerts (id, "medication_id", "contact_info", status, "createdAt")
              VALUES (gen_random_uuid(), $1, $2, $3, NOW())
            `, [medicationId, contactInfo, status])
          }
        } else {
          throw error
        }
      }
    }
    console.log('✅ 50 additional alerts created')

    // Create additional audit logs (200 more)
    const allUserIds = [adminId, ...pharmacistIds, ...patientIds]
    const actions = ['LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'SEARCH', 'VIEW']
    
    for (let i = 0; i < 200; i++) {
      // Check connection every 50 logs
      if (i % 50 === 0) {
        await ensureConnection()
      }
      
      const userId = faker.helpers.arrayElement(allUserIds)
      const action = faker.helpers.arrayElement(actions)
      const details = JSON.stringify({
        ip: faker.internet.ip(),
        userAgent: faker.internet.userAgent(),
        timestamp: faker.date.recent().toISOString()
      })

      try {
        await client.query(`
          INSERT INTO audit_logs (id, "user_id", action, details, "createdAt")
          VALUES (gen_random_uuid(), $1, $2, $3, NOW())
        `, [userId, action, details])
      } catch (error: any) {
        if (error.code === '57P01' || error.message?.includes('Connection terminated')) {
          await ensureConnection()
          // Retry
          await client.query(`
            INSERT INTO audit_logs (id, "user_id", action, details, "createdAt")
            VALUES (gen_random_uuid(), $1, $2, $3, NOW())
          `, [userId, action, details])
        } else {
          throw error
        }
      }
    }
    console.log('✅ 200 additional audit logs created')

    console.log('🎉 Database seeded successfully!')
    console.log('')
    console.log('📊 Summary:')

    const summary = await Promise.all([
      client.query('SELECT COUNT(*) as count FROM users'),
      client.query('SELECT COUNT(*) as count FROM pharmacies'),
      client.query('SELECT COUNT(*) as count FROM medications'),
      client.query('SELECT COUNT(*) as count FROM stocks'),
      client.query('SELECT COUNT(*) as count FROM searches'),
      client.query('SELECT COUNT(*) as count FROM alerts'),
      client.query('SELECT COUNT(*) as count FROM audit_logs')
    ])

    console.log(`- ${summary[0].rows[0].count} users`)
    console.log(`- ${summary[1].rows[0].count} pharmacies`)
    console.log(`- ${summary[2].rows[0].count} medications`)
    console.log(`- ${summary[3].rows[0].count} stock entries`)
    console.log(`- ${summary[4].rows[0].count} searches`)
    console.log(`- ${summary[5].rows[0].count} alerts`)
    console.log(`- ${summary[6].rows[0].count} audit logs`)

  } finally {
    await client.end()
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
