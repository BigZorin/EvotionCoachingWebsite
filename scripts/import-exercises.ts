/**
 * Import exercises from free-exercise-db into our database
 *
 * Usage:
 *   npx tsx scripts/import-exercises.ts
 */

import { PrismaClient } from '@evotion/database'

const prisma = new PrismaClient()

// Fetch exercises from free-exercise-db
async function fetchExercises() {
  const response = await fetch(
    'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json'
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch exercises: ${response.statusText}`)
  }

  return response.json()
}

// Map category to our enum
function mapCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    'strength': 'STRENGTH',
    'cardio': 'CARDIO',
    'stretching': 'FLEXIBILITY',
    'plyometrics': 'CARDIO',
    'powerlifting': 'STRENGTH',
    'strongman': 'STRENGTH',
    'olympic weightlifting': 'STRENGTH',
  }

  return categoryMap[category.toLowerCase()] || 'STRENGTH'
}

// Map difficulty level to our enum
function mapDifficulty(level: string): string {
  const difficultyMap: Record<string, string> = {
    'beginner': 'BEGINNER',
    'intermediate': 'INTERMEDIATE',
    'expert': 'ADVANCED',
  }

  return difficultyMap[level.toLowerCase()] || 'BEGINNER'
}

// Normalize muscle group names to match our system
function normalizeMuscleGroups(muscles: string[]): string[] {
  const muscleMap: Record<string, string> = {
    'abdominals': 'abs',
    'lower back': 'lower back',
    'middle back': 'back',
    'lats': 'back',
    'chest': 'chest',
    'shoulders': 'shoulders',
    'biceps': 'biceps',
    'triceps': 'triceps',
    'forearms': 'forearms',
    'glutes': 'glutes',
    'quadriceps': 'quads',
    'hamstrings': 'hamstrings',
    'calves': 'calves',
    'abductors': 'abductors',
    'adductors': 'adductors',
    'traps': 'back',
    'neck': 'back',
  }

  return [...new Set(
    muscles.map(m => muscleMap[m.toLowerCase()] || m.toLowerCase())
  )]
}

async function importExercises() {
  console.log('🏋️  Fetching exercises from free-exercise-db...')

  const exercises = await fetchExercises()
  console.log(`📊 Found ${exercises.length} exercises`)

  // Find or create a system user for public exercises
  let systemUser = await prisma.user.findFirst({
    where: { email: 'system@evotion.app' }
  })

  if (!systemUser) {
    console.log('👤 Creating system user for public exercises...')
    systemUser = await prisma.user.create({
      data: {
        id: 'system-public-exercises',
        email: 'system@evotion.app',
        role: 'ADMIN',
      }
    })
  }

  console.log('📥 Importing exercises...')

  let imported = 0
  let skipped = 0
  let errors = 0

  for (const ex of exercises) {
    try {
      // Check if exercise already exists
      const existing = await prisma.exercise.findFirst({
        where: {
          name: ex.name,
          createdBy: systemUser.id,
        }
      })

      if (existing) {
        skipped++
        continue
      }

      // Combine primary and secondary muscles
      const allMuscles = [
        ...(ex.primaryMuscles || []),
        ...(ex.secondaryMuscles || [])
      ]

      // Create exercise
      await prisma.exercise.create({
        data: {
          name: ex.name,
          description: ex.instructions ? ex.instructions.join('\n\n') : null,
          category: mapCategory(ex.category || 'strength'),
          difficulty: mapDifficulty(ex.level || 'beginner'),
          equipmentNeeded: ex.equipment || 'body only',
          muscleGroups: normalizeMuscleGroups(allMuscles),
          cues: ex.instructions ? ex.instructions.slice(0, 3).join('\n\n') : null,
          // Images from free-exercise-db GitHub
          thumbnailUrl: ex.images && ex.images[0]
            ? `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${ex.images[0]}`
            : null,
          isPublic: true, // Mark as public/platform exercise
          createdBy: systemUser.id,
        }
      })

      imported++

      if (imported % 10 === 0) {
        console.log(`   ✓ Imported ${imported} exercises...`)
      }

    } catch (error: any) {
      console.error(`   ✗ Error importing "${ex.name}":`, error.message)
      errors++
    }
  }

  console.log('\n✅ Import complete!')
  console.log(`   📊 Total exercises: ${exercises.length}`)
  console.log(`   ✓ Imported: ${imported}`)
  console.log(`   ⊘ Skipped (duplicates): ${skipped}`)
  console.log(`   ✗ Errors: ${errors}`)

  await prisma.$disconnect()
}

// Run import
importExercises()
  .catch((error) => {
    console.error('❌ Import failed:', error)
    process.exit(1)
  })
