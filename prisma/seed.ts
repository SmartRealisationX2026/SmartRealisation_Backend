import * as bcrypt from 'bcrypt'
import { Client } from 'pg'

// Use direct PostgreSQL client to seed data
const client = new Client({
  connectionString: process.env.DATABASE_URL,
})

async function main() {
  console.log('🌱 Seeding database with raw SQL...')

  await client.connect()

  // Hash password for users
  const hashedPassword = await bcrypt.hash('password123', 10)

  try {
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
    console.log('✅ Pharmacist users created')

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
    console.log('✅ Patient users created')

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
    `, [pharmacist1Id])
    const pharmacy3Id = pharmacy3Result.rows[0].id
    console.log('✅ Pharmacies created')

    // Create medications
    const medications = []
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
    console.log('✅ Medications created')

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
    console.log('✅ Stocks created')

    // Create searches
    await client.query(`
      INSERT INTO searches (id, "user_id", "medication_id", latitude, longitude, "results_count", "createdAt")
      VALUES (gen_random_uuid(), $1, $2, 4.051056, 9.767869, 2, NOW())
    `, [patient1Id, medications[0]]) // Authenticated search with GPS

    await client.query(`
      INSERT INTO searches (id, "medication_id", latitude, longitude, "results_count", "createdAt")
      VALUES (gen_random_uuid(), $1, 3.866667, 11.516667, 1, NOW())
    `, [medications[1]]) // Anonymous search with GPS
    console.log('✅ Searches created')

    // Create alerts
    await client.query(`
      INSERT INTO alerts (id, "user_id", "medication_id", "pharmacy_id", "contact_info", status, "createdAt")
      VALUES (gen_random_uuid(), $1, $2, $3, $4, 'PENDING', NOW())
    `, [patient1Id, medications[2], pharmacy1Id, 'patient1@medilink.cm']) // User alert

    await client.query(`
      INSERT INTO alerts (id, "medication_id", "contact_info", status, "createdAt")
      VALUES (gen_random_uuid(), $1, '+237695555555', 'PENDING', NOW())
    `, [medications[1]]) // Anonymous alert
    console.log('✅ Alerts created')

    // Create audit logs
    await client.query(`
      INSERT INTO audit_logs (id, "user_id", action, details, "createdAt")
      VALUES (gen_random_uuid(), $1, 'LOGIN', '{"ip": "127.0.0.1", "userAgent": "seed-script"}', NOW())
    `, [adminId])
    console.log('✅ Audit logs created')

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
