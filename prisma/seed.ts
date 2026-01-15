import 'dotenv/config'
import * as bcrypt from 'bcrypt'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { faker } from '@faker-js/faker'
import { PrismaClient } from 'src/generated/prisma';

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// Set seed for reproducible results
faker.seed(12345)

async function main() {
  console.log('🌱 Seeding database with new MLD v2 schema + Faker.js v8...')
  console.log('')

  try {
    // ============================================
    // DEMO DATA - GUARANTEED FOR ALL USE CASES
    // ============================================
    console.log('🎯 Creating guaranteed demo data...')

    // Demo cities (ensuring major cities exist)
    const demoCities = [
      { nameFr: 'Yaoundé', nameEn: 'Yaounde', region: 'Centre' },
      { nameFr: 'Douala', nameEn: 'Douala', region: 'Littoral' },
      { nameFr: 'Bafoussam', nameEn: 'Bafoussam', region: 'Ouest' },
      { nameFr: 'Bamenda', nameEn: 'Bamenda', region: 'Nord-Ouest' }
    ]

    const cities: any[] = []
    for (const cityData of demoCities) {
      // Check if city already exists
      let city = await prisma.city.findFirst({
        where: { nameFr: cityData.nameFr }
      })

      if (!city) {
        city = await prisma.city.create({
          data: cityData
        })
      }
      cities.push(city)

      // Create districts for demo cities if they don't exist
      const existingDistricts = await prisma.district.findMany({
        where: { cityId: city.id }
      })

      if (existingDistricts.length === 0) {
        await Promise.all([
          prisma.district.create({
            data: {
              cityId: city.id,
              nameFr: 'Centre-ville',
              nameEn: 'City Center'
            }
          }),
          prisma.district.create({
            data: {
              cityId: city.id,
              nameFr: 'Quartier Administratif',
              nameEn: 'Administrative District'
            }
          })
        ])
      }
    }

    // Demo medication categories
    const demoCategories = [
      { code: 'ANALG', nameFr: 'Antalgiques', nameEn: 'Analgesics', level: 1 },
      { code: 'ANTIB', nameFr: 'Antibiotiques', nameEn: 'Antibiotics', level: 1 },
      { code: 'ANTI_INFL', nameFr: 'Anti-inflammatoires', nameEn: 'Anti-inflammatories', level: 1 },
      { code: 'VIT', nameFr: 'Vitamines', nameEn: 'Vitamins', level: 1 }
    ]

    const categories: any[] = []
    for (const catData of demoCategories) {
      const category = await prisma.category.upsert({
        where: { code: catData.code },
        update: {},
        create: catData
      })
      categories.push(category)
    }

    // Demo medication forms
    const demoForms = [
      { code: 'TAB', nameFr: 'Comprimé', nameEn: 'Tablet' },
      { code: 'CAP', nameFr: 'Gélule', nameEn: 'Capsule' },
      { code: 'SYR', nameFr: 'Sirop', nameEn: 'Syrup' }
    ]

    const forms: any[] = []
    for (const formData of demoForms) {
      const form = await prisma.medicationForm.upsert({
        where: { code: formData.code },
        update: {},
        create: formData
      })
      forms.push(form)
    }

    // Demo medications (guaranteed to exist for testing)
    const demoMedications = [
      {
        commercialName: 'Paracétamol',
        dciName: 'Paracetamol',
        dosageStrength: '500',
        dosageUnit: 'mg',
        requiresPrescription: false,
        categoryCode: 'ANALG',
        formCode: 'TAB'
      },
      {
        commercialName: 'Ibuprofène',
        dciName: 'Ibuprofen',
        dosageStrength: '400',
        dosageUnit: 'mg',
        requiresPrescription: false,
        categoryCode: 'ANTI_INFL',
        formCode: 'TAB'
      },
      {
        commercialName: 'Amoxicilline',
        dciName: 'Amoxicillin',
        dosageStrength: '500',
        dosageUnit: 'mg',
        requiresPrescription: true,
        categoryCode: 'ANTIB',
        formCode: 'CAP'
      },
      {
        commercialName: 'Vitamine C',
        dciName: 'Ascorbic Acid',
        dosageStrength: '500',
        dosageUnit: 'mg',
        requiresPrescription: false,
        categoryCode: 'VIT',
        formCode: 'TAB'
      },
      {
        commercialName: 'Aspirine',
        dciName: 'Acetylsalicylic Acid',
        dosageStrength: '100',
        dosageUnit: 'mg',
        requiresPrescription: false,
        categoryCode: 'ANALG',
        formCode: 'TAB'
      }
    ]

    const medications: any[] = []
    for (const medData of demoMedications) {
      const category = categories.find(c => c.code === medData.categoryCode)
      const form = forms.find(f => f.code === medData.formCode)

      if (!category || !form) {
        throw new Error(`Category or form not found for ${medData.commercialName}`)
      }

      // Check if medication already exists
      let medication = await prisma.medication.findFirst({
        where: {
          commercialName: medData.commercialName,
          dosageStrength: medData.dosageStrength,
          dosageUnit: medData.dosageUnit
        }
      })

      if (!medication) {
        medication = await prisma.medication.create({
          data: {
            commercialName: medData.commercialName,
            dciName: medData.dciName,
            dosageStrength: medData.dosageStrength,
            dosageUnit: medData.dosageUnit,
            requiresPrescription: medData.requiresPrescription,
            categoryId: category.id,
            formId: form.id
          }
        })
      }
      medications.push(medication)
    }

    // Demo users
    const hashedPassword = await bcrypt.hash('password123', 10)

    // Demo admin
    const admin = await prisma.user.upsert({
      where: { email: 'admin@medilink.cm' },
      update: {},
      create: {
        email: 'admin@medilink.cm',
        passwordHash: hashedPassword,
        role: 'ADMIN',
        fullName: 'Admin MediLink',
        phone: '+237690000000',
        preferredLanguage: 'FR'
      }
    })

    // Demo pharmacists
    const demoPharmacists = [
      {
        email: 'pharmacist.yaounde@medilink.cm',
        fullName: 'Jean Dupont',
        phone: '+237691111111',
        cityName: 'Yaoundé'
      },
      {
        email: 'pharmacist.douala@medilink.cm',
        fullName: 'Marie Ngo',
        phone: '+237692222222',
        cityName: 'Douala'
      }
    ]

    const pharmacists: any[] = []
    for (const pharmaData of demoPharmacists) {
      const pharmacist = await prisma.user.upsert({
        where: { email: pharmaData.email },
        update: {},
        create: {
          email: pharmaData.email,
          passwordHash: hashedPassword,
          role: 'PHARMACIST',
          fullName: pharmaData.fullName,
          phone: pharmaData.phone,
          preferredLanguage: 'FR'
        }
      })
      pharmacists.push({ ...pharmacist, targetCity: pharmaData.cityName })
    }

    // Demo patients
    const demoPatients = [
      {
        email: 'patient.demo@medilink.cm',
        fullName: 'Alice Johnson',
        phone: '+237693333333'
      },
      {
        email: 'patient.test@medilink.cm',
        fullName: 'Bob Wilson',
        phone: '+237694444444'
      }
    ]

    const patients: any[] = []
    for (const patientData of demoPatients) {
      const patient = await prisma.user.upsert({
        where: { email: patientData.email },
        update: {},
        create: {
          email: patientData.email,
          passwordHash: hashedPassword,
          role: 'PATIENT',
          fullName: patientData.fullName,
          phone: patientData.phone,
          preferredLanguage: 'FR'
        }
      })
      patients.push(patient)
    }

    // Demo pharmacies with guaranteed addresses and stock
    const demoPharmacies = [
      {
        name: 'Pharmacie Centrale Yaoundé',
        pharmacistEmail: 'pharmacist.yaounde@medilink.cm',
        cityName: 'Yaoundé',
        coordinates: [3.8667, 11.5167], // Yaoundé center
        verified: true,
        medications: ['Paracétamol', 'Ibuprofène', 'Amoxicilline']
      },
      {
        name: 'Pharmacie du Littoral',
        pharmacistEmail: 'pharmacist.douala@medilink.cm',
        cityName: 'Douala',
        coordinates: [4.0511, 9.7679], // Douala center
        verified: true,
        medications: ['Paracétamol', 'Vitamine C', 'Aspirine']
      },
      {
        name: 'Pharmacie Nouvelle',
        pharmacistEmail: 'pharmacist.yaounde@medilink.cm', // Same owner, different location
        cityName: 'Yaoundé',
        coordinates: [3.8600, 11.5100], // Different location in Yaoundé
        verified: false, // For admin validation demo
        medications: ['Ibuprofène', 'Amoxicilline']
      }
    ]

    const pharmacies: any[] = []
    for (const pharmaData of demoPharmacies) {
      const city = cities.find(c => c.nameFr === pharmaData.cityName)
      const pharmacist = pharmacists.find(p => p.email === pharmaData.pharmacistEmail)

      if (!city || !pharmacist) {
        throw new Error(`City or pharmacist not found for ${pharmaData.name}`)
      }

      // Get districts for the city
      const districts = await prisma.district.findMany({
        where: { cityId: city.id }
      })

      if (districts.length === 0) {
        throw new Error(`No districts found for city ${city.nameFr}`)
      }

      const district = districts[0] // Use first district

      // Create address
      const address = await prisma.address.create({
        data: {
          cityId: city.id,
          districtId: district.id,
          streetAddress: `${pharmaData.name}, ${district.nameFr}`,
          landmark: `Près du centre-ville`,
          postalCode: faker.location.zipCode(),
          latitude: pharmaData.coordinates[0],
          longitude: pharmaData.coordinates[1]
        }
      })

      // Create pharmacy
      const pharmacy = await prisma.pharmacy.create({
        data: {
          name: pharmaData.name,
          addressId: address.id,
          licenseNumber: `LIC${faker.string.numeric(6)}`,
          phone: pharmacist.phone,
          emergencyPhone: `+237${faker.string.numeric(9)}`,
          is24_7: pharmaData.name.includes('Centrale'), // Only central pharmacy is 24/7
          openingTime: new Date('1970-01-01T08:00:00Z'),
          closingTime: new Date('1970-01-01T18:00:00Z'),
          workingDays: [1,2,3,4,5,6,7], // All days
          ownerId: pharmacist.id,
          isVerified: pharmaData.verified
        }
      })

      pharmacies.push({ ...pharmacy, demoMeds: pharmaData.medications })
    }

    // Add guaranteed stock for demo pharmacies
    for (const pharmacy of pharmacies) {
      for (const medName of pharmacy.demoMeds) {
        const medication = medications.find(m => m.commercialName === medName)
        if (medication) {
          await prisma.inventoryItem.upsert({
            where: {
              pharmacyId_medicationId_batchNumber: {
                pharmacyId: pharmacy.id,
                medicationId: medication.id,
                batchNumber: `DEMO${pharmacy.id.slice(0, 8)}`
              }
            },
            update: {},
            create: {
              pharmacyId: pharmacy.id,
              medicationId: medication.id,
              batchNumber: `DEMO${pharmacy.id.slice(0, 8)}`,
              expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
              quantityInStock: medName === 'Paracétamol' ? 150 : faker.number.int({ min: 20, max: 100 }),
              unitPriceFcfa: faker.number.int({ min: 100, max: 300 }),
              sellingPriceFcfa: faker.number.int({ min: 200, max: 800 }),
              lastRestocked: new Date()
            }
          })
        }
      }
    }

    // Add some demo searches
    for (const patient of patients.slice(0, 1)) { // Just one patient for demo
      await prisma.search.create({
        data: {
          userId: patient.id,
          medicationId: medications[0].id, // Paracetamol
          latitude: 3.8667,
          longitude: 11.5167,
          radiusKm: 10,
          resultsFound: 2
        }
      })
    }

    // Add demo stock alerts
    for (const patient of patients) {
      await prisma.stockAlert.create({
        data: {
          userId: patient.id,
          medicationId: medications[0].id, // Paracetamol
          notificationChannel: 'EMAIL',
          contactInfo: patient.email,
          status: 'ACTIVE'
        }
      })
    }

    console.log('✅ Demo data created successfully')
    console.log('   📍 Cities: Yaoundé, Douala, Bafoussam, Bamenda')
    console.log('   💊 Medications: Paracétamol, Ibuprofène, Amoxicilline, Vitamine C, Aspirine')
    console.log('   🏥 Pharmacies: 2 verified + 1 unverified for admin validation')
    console.log('   👥 Users: 1 admin, 2 pharmacists, 2 patients')
    console.log('')

    // ============================================
    // REFERENCE DATA (cities, districts, categories, forms) - REMAINING
    // ============================================
    console.log('📝 Creating additional reference data...')

    // Additional cities beyond demo ones
    const additionalCitiesData = [
      { nameFr: 'Garoua', nameEn: 'Garoua', region: 'Nord' },
      { nameFr: 'Maroua', nameEn: 'Maroua', region: 'Extrême-Nord' },
      { nameFr: 'Buea', nameEn: 'Buea', region: 'Sud-Ouest' },
      { nameFr: 'Limbe', nameEn: 'Limbe', region: 'Sud-Ouest' },
      { nameFr: 'Kribi', nameEn: 'Kribi', region: 'Sud' },
      { nameFr: 'Ebolowa', nameEn: 'Ebolowa', region: 'Sud' }
    ]

    for (const cityData of additionalCitiesData) {
      // Check if city already exists
      let city = await prisma.city.findFirst({
        where: { nameFr: cityData.nameFr }
      })

      if (!city) {
        city = await prisma.city.create({
          data: cityData
        })
      }

      // Create districts for additional cities
      const existingDistricts2 = await prisma.district.findMany({
        where: { cityId: city.id }
      })

      if (existingDistricts2.length === 0) {
        await Promise.all([
          prisma.district.create({
            data: {
              cityId: city.id,
              nameFr: 'Centre-ville',
              nameEn: 'City Center'
            }
          }),
          prisma.district.create({
            data: {
              cityId: city.id,
              nameFr: 'Quartier Administratif',
              nameEn: 'Administrative District'
            }
          })
        ])
      }
    }

    // Additional categories beyond demo ones
    const additionalCategoriesData = [
      { code: 'CARDIO', nameFr: 'Cardiovasculaires', nameEn: 'Cardiovascular', level: 1 },
      { code: 'DERM', nameFr: 'Dermatologiques', nameEn: 'Dermatological', level: 1 }
    ]

    for (const catData of additionalCategoriesData) {
      await prisma.category.upsert({
        where: { code: catData.code },
        update: {},
        create: catData
      })
    }

    // Additional medication forms
    const additionalFormsData = [
      { code: 'INJ', nameFr: 'Injection', nameEn: 'Injection' },
      { code: 'OINT', nameFr: 'Pommade', nameEn: 'Ointment' },
      { code: 'DROP', nameFr: 'Gouttes', nameEn: 'Drops' }
    ]

    for (const formData of additionalFormsData) {
      await prisma.medicationForm.upsert({
        where: { code: formData.code },
        update: {},
        create: formData
      })
    }

    console.log('✅ Reference data created')

    // ============================================
    // USERS (PATIENTS, PHARMACISTS, ADMINS)
    // ============================================
    console.log('👥 Creating users...')

    const hashedPassword2 = await bcrypt.hash('password123', 10)

    // Admin user
    const admin2 = await prisma.user.upsert({
      where: { email: 'admin@medilink.cm' },
      update: {},
      create: {
        email: 'admin@medilink.cm',
        passwordHash: hashedPassword2,
        role: 'ADMIN',
        fullName: 'Admin MediLink',
        phone: '+237690000000',
        preferredLanguage: 'FR'
      }
    })

    // Pharmacists
    const pharmacists2: any[] = []
    for (let i = 0; i < 15; i++) {
      const pharmacist = await prisma.user.upsert({
        where: { email: `pharmacist${i}@medilink.cm` },
        update: {},
        create: {
          email: `pharmacist${i}@medilink.cm`,
          passwordHash: hashedPassword2,
          role: 'PHARMACIST',
          fullName: faker.person.fullName(),
          phone: `+23769${faker.string.numeric(7)}`,
          preferredLanguage: faker.helpers.arrayElement(['FR', 'EN'])
        }
      })
      pharmacists2.push(pharmacist)
    }

    // Patients
    const patients2: any[] = []
    for (let i = 0; i < 100; i++) {
      const patient = await prisma.user.upsert({
        where: { email: `patient${i}@medilink.cm` },
        update: {},
        create: {
          email: `patient${i}@medilink.cm`,
          passwordHash: hashedPassword2,
          role: 'PATIENT',
          fullName: faker.person.fullName(),
          phone: `+23769${faker.string.numeric(7)}`,
          preferredLanguage: faker.helpers.arrayElement(['FR', 'EN'])
        }
      })
      patients2.push(patient)
    }

    console.log('✅ Users created')

    // ============================================
    // PHARMACIES (with addresses)
    // ============================================
    console.log('🏥 Creating pharmacies with addresses...')

    const pharmacies2: any[] = []
    for (const pharmacist of pharmacists2) {
      const city = faker.helpers.arrayElement(cities)
      const districts = await prisma.district.findMany({
        where: { cityId: city.id }
      })
      if (districts.length === 0) {
        throw new Error(`No districts found for city ${city.id}`)
      }
      const district = faker.helpers.arrayElement(districts)

      // Create address
      const address = await prisma.address.create({
        data: {
          cityId: city.id,
          districtId: district.id,
          streetAddress: faker.location.streetAddress(),
          landmark: faker.company.name(),
          postalCode: faker.location.zipCode(),
          latitude: parseFloat(faker.location.latitude({ min: 1.65, max: 13.08 }).toFixed(8)),
          longitude: parseFloat(faker.location.longitude({ min: 8.49, max: 16.19 }).toFixed(8))
        }
      })

      // Create pharmacy
      const pharmacy = await prisma.pharmacy.create({
        data: {
          name: `Pharmacie ${faker.company.name()}`,
          addressId: address.id,
          licenseNumber: `LIC${faker.string.numeric(6)}`,
          phone: `+237${faker.string.numeric(9)}`,
          emergencyPhone: `+237${faker.string.numeric(9)}`,
          is24_7: faker.datatype.boolean(),
          openingTime: new Date('1970-01-01T08:00:00Z'),
          closingTime: new Date('1970-01-01T18:00:00Z'),
          workingDays: [1,2,3,4,5,6,7], // All days
          ownerId: pharmacist.id,
          isVerified: faker.datatype.boolean({ probability: 0.8 })
        }
      })
      pharmacies2.push(pharmacy)
    }

    console.log('✅ Pharmacies created')

    // ============================================
    // MEDICATIONS
    // ============================================
    console.log('💊 Creating medications...')

    const medications2: any[] = []
    const medicationData = [
      { commercialName: 'Paracétamol', dciName: 'Paracetamol', dosageStrength: '500', dosageUnit: 'mg', requiresPrescription: false },
      { commercialName: 'Amoxicilline', dciName: 'Amoxicillin', dosageStrength: '500', dosageUnit: 'mg', requiresPrescription: true },
      { commercialName: 'Ibuprofène', dciName: 'Ibuprofen', dosageStrength: '400', dosageUnit: 'mg', requiresPrescription: false },
      { commercialName: 'Vitamine C', dciName: 'Ascorbic Acid', dosageStrength: '500', dosageUnit: 'mg', requiresPrescription: false },
      { commercialName: 'Oméprazole', dciName: 'Omeprazole', dosageStrength: '20', dosageUnit: 'mg', requiresPrescription: false },
      { commercialName: 'Doliprane', dciName: 'Paracetamol', dosageStrength: '1000', dosageUnit: 'mg', requiresPrescription: false },
      { commercialName: 'Augmentin', dciName: 'Amoxicillin + Clavulanic acid', dosageStrength: '875/125', dosageUnit: 'mg', requiresPrescription: true },
      { commercialName: 'Voltarène', dciName: 'Diclofenac', dosageStrength: '50', dosageUnit: 'mg', requiresPrescription: false }
    ]

    for (const medData of medicationData) {
      const medication = await prisma.medication.create({
        data: {
          ...medData,
          categoryId: faker.helpers.arrayElement(categories).id,
          formId: faker.helpers.arrayElement(forms).id
        }
      })
      medications2.push(medication)
    }

    // Additional fake medications
    for (let i = 0; i < 50; i++) {
      const medication = await prisma.medication.create({
        data: {
          commercialName: faker.commerce.productName(),
          dciName: faker.word.noun() + ' ' + faker.word.adjective(),
          categoryId: faker.helpers.arrayElement(categories).id,
          formId: faker.helpers.arrayElement(forms).id,
          dosageStrength: faker.helpers.arrayElement(['100', '250', '500', '1000']),
          dosageUnit: faker.helpers.arrayElement(['mg', 'ml', 'g']),
          requiresPrescription: faker.datatype.boolean({ probability: 0.3 })
        }
      })
      medications2.push(medication)
    }

    console.log('✅ Medications created')

    // ============================================
    // INVENTORY ITEMS (remplace stocks)
    // ============================================
    console.log('📦 Creating inventory items...')

    for (const pharmacy of pharmacies) {
      // Each pharmacy has 10-20 different medications
      const pharmacyMeds = faker.helpers.arrayElements(medications, faker.number.int({ min: 10, max: 20 }))

      for (const medication of pharmacyMeds) {
        await prisma.inventoryItem.create({
          data: {
            pharmacyId: pharmacy.id,
            medicationId: medication.id,
            batchNumber: `BATCH${faker.string.numeric(6)}`,
            expirationDate: faker.date.future({ years: 2 }),
            quantityInStock: faker.number.int({ min: 0, max: 500 }),
            unitPriceFcfa: parseFloat(faker.commerce.price({ min: 100, max: 5000, dec: 2 })),
            sellingPriceFcfa: parseFloat(faker.commerce.price({ min: 200, max: 10000, dec: 2 })),
            lastRestocked: faker.date.recent()
          }
        })
      }
    }

    console.log('✅ Inventory items created')

    // ============================================
    // SEARCHES
    // ============================================
    console.log('🔍 Creating searches...')

    for (let i = 0; i < 200; i++) {
      const hasUser = faker.datatype.boolean({ probability: 0.7 })
      const user = hasUser ? faker.helpers.arrayElement(patients) : null

      await prisma.search.create({
        data: {
          userId: user?.id,
          medicationId: faker.helpers.arrayElement(medications).id,
          latitude: parseFloat(faker.location.latitude({ min: 1.65, max: 13.08 }).toFixed(8)),
          longitude: parseFloat(faker.location.longitude({ min: 8.49, max: 16.19 }).toFixed(8)),
          radiusKm: faker.number.int({ min: 1, max: 50 }),
          filtersApplied: {
            is24_7: faker.datatype.boolean(),
            maxPrice: faker.number.int({ min: 100, max: 5000 })
          },
          resultsFound: faker.number.int({ min: 0, max: 20 })
        }
      })
    }

    console.log('✅ Searches created')

    // ============================================
    // STOCK ALERTS (remplace alerts)
    // ============================================
    console.log('🔔 Creating stock alerts...')

    for (let i = 0; i < 100; i++) {
      const user = faker.helpers.arrayElement(patients)
      const medication = faker.helpers.arrayElement(medications)
      const hasPharmacy = faker.datatype.boolean({ probability: 0.5 })
      const pharmacy = hasPharmacy ? faker.helpers.arrayElement(pharmacies) : null

      await prisma.stockAlert.create({
        data: {
          userId: user.id,
          medicationId: medication.id,
          pharmacyId: pharmacy?.id,
          notificationChannel: faker.helpers.arrayElement(['EMAIL', 'SMS', 'PUSH']),
          contactInfo: faker.datatype.boolean() ? faker.internet.email() : `+237${faker.string.numeric(9)}`,
          status: faker.helpers.arrayElement(['ACTIVE', 'TRIGGERED', 'EXPIRED']),
          triggeredAt: faker.datatype.boolean() ? faker.date.recent() : null,
          expiresAt: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000) // 6 months from now
        }
      })
    }

    console.log('✅ Stock alerts created')

    // ============================================
    // PRICE HISTORY
    // ============================================
    console.log('💰 Creating price history...')

    const inventoryItems = await prisma.inventoryItem.findMany()
    const selectedItems = faker.helpers.arrayElements(inventoryItems, Math.min(50, inventoryItems.length))
    for (const item of selectedItems) {
      await prisma.priceHistory.create({
        data: {
          inventoryItemId: item.id,
          oldPriceFcfa: parseFloat(faker.commerce.price({ min: 50, max: 1000, dec: 2 })),
          newPriceFcfa: item.sellingPriceFcfa,
          changedBy: faker.helpers.arrayElement(pharmacists).id
        }
      })
    }

    console.log('✅ Price history created')

    // ============================================
    // ADMIN ANALYTICS
    // ============================================
    console.log('📊 Creating admin analytics...')

    for (let i = 0; i < 30; i++) {
      await prisma.adminAnalytics.create({
        data: {
          analyticsDate: faker.date.recent({ days: 30 }),
          totalSearches: faker.number.int({ min: 100, max: 1000 }),
          successfulSearches: faker.number.int({ min: 50, max: 800 }),
          newUsers: faker.number.int({ min: 1, max: 20 }),
          activePharmacies: faker.number.int({ min: 5, max: 50 }),
          topMedications: Array.from({ length: 10 }, () => ({
            id: faker.helpers.arrayElement(medications).id,
            name: faker.commerce.productName(),
            searches: faker.number.int({ min: 10, max: 200 })
          })),
          searchHeatmap: Array.from({ length: 20 }, () => ({
            lat: parseFloat(faker.location.latitude({ min: 1.65, max: 13.08 }).toFixed(6)),
            lng: parseFloat(faker.location.longitude({ min: 8.49, max: 16.19 }).toFixed(6)),
            intensity: faker.number.int({ min: 1, max: 100 })
          }))
        }
      })
    }

    console.log('✅ Admin analytics created')

    // ============================================
    // SYSTEM AUDIT LOGS
    // ============================================
    console.log('📋 Creating system audit logs...')

    const allUsers = [admin, ...pharmacists, ...patients]
    const actions = ['CREATE', 'UPDATE', 'DELETE'] // Only valid ActionType enum values

    for (let i = 0; i < 500; i++) {
      const user = faker.helpers.arrayElement(allUsers)
      const action = faker.helpers.arrayElement(actions)

      await prisma.systemAuditLog.create({
        data: {
          userId: user.id,
          actionType: action as any,
          entityType: faker.helpers.arrayElement(['USER', 'PHARMACY', 'MEDICATION', 'SEARCH', 'ALERT']),
          entityId: faker.string.uuid(),
          oldValues: faker.datatype.boolean() ? { oldField: faker.lorem.word() } : undefined,
          newValues: faker.datatype.boolean() ? { newField: faker.lorem.word() } : undefined,
          ipAddress: faker.internet.ip()
        }
      })
    }

    console.log('✅ System audit logs created')

    console.log('')
    console.log('🎉 Database seeded successfully with new MLD v2 schema!')
    console.log('📊 Summary:')

    const [
      userCount,
      pharmacyCount,
      medicationCount,
      inventoryCount,
      searchCount,
      alertCount,
      auditCount
    ] = await Promise.all([
      prisma.user.count(),
      prisma.pharmacy.count(),
      prisma.medication.count(),
      prisma.inventoryItem.count(),
      prisma.search.count(),
      prisma.stockAlert.count(),
      prisma.systemAuditLog.count()
    ])

    console.log(`- ${userCount} users (patients: ${patients.length}, pharmacists: ${pharmacists.length}, admins: 1)`)
    console.log(`- ${pharmacyCount} pharmacies`)
    console.log(`- ${medicationCount} medications`)
    console.log(`- ${inventoryCount} inventory items`)
    console.log(`- ${searchCount} searches`)
    console.log(`- ${alertCount} stock alerts`)
    console.log(`- ${auditCount} audit logs`)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
