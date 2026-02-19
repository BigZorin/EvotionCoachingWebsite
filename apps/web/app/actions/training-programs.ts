"use server"

import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// ============================================
// Auth helpers
// ============================================

async function checkAuth() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
        },
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { authorized: false as const, user: null }
  const role = user.user_metadata?.role || "CLIENT"
  if (role !== "ADMIN" && role !== "COACH") return { authorized: false as const, user: null }
  return { authorized: true as const, user }
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

// ============================================
// PROGRAMS
// ============================================

export async function getTrainingPrograms() {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("training_programs")
    .select(`
      *,
      program_blocks (
        id, name, order_index, duration_weeks,
        block_workouts ( id )
      )
    `)
    .eq("coach_id", auth.user.id)
    .order("created_at", { ascending: false })

  if (error) return { success: false, error: error.message }

  const programs = (data || []).map((p: any) => ({
    ...p,
    blockCount: p.program_blocks?.length || 0,
    totalWorkouts: p.program_blocks?.reduce(
      (sum: number, b: any) => sum + (b.block_workouts?.length || 0), 0
    ) || 0,
  }))

  return { success: true, programs }
}

export async function getTrainingProgram(programId: string) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("training_programs")
    .select(`
      *,
      program_blocks (
        id, name, description, order_index, duration_weeks,
        block_workouts (
          id, workout_template_id, order_index, day_of_week, notes,
          workout_templates (
            id, name, description, duration_minutes,
            workout_template_exercises (
              id, order_index, sets, reps, rest_seconds,
              exercises ( id, name, category, thumbnail_url, gif_url )
            )
          )
        )
      )
    `)
    .eq("id", programId)
    .eq("coach_id", auth.user.id)
    .single()

  if (error) return { success: false, error: error.message }

  // Sort blocks and workouts by order_index
  if (data?.program_blocks) {
    data.program_blocks.sort((a: any, b: any) => a.order_index - b.order_index)
    data.program_blocks.forEach((block: any) => {
      if (block.block_workouts) {
        block.block_workouts.sort((a: any, b: any) => a.order_index - b.order_index)
      }
    })
  }

  return { success: true, program: data }
}

export async function createTrainingProgram(data: {
  name: string
  description?: string
  bannerUrl?: string
  bannerStoragePath?: string
}) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()
  const { data: program, error } = await supabase
    .from("training_programs")
    .insert({
      coach_id: auth.user.id,
      name: data.name,
      description: data.description || null,
      banner_url: data.bannerUrl || null,
      banner_storage_path: data.bannerStoragePath || null,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, program }
}

export async function updateTrainingProgram(programId: string, data: {
  name?: string
  description?: string
  bannerUrl?: string
  bannerStoragePath?: string
  isActive?: boolean
}) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()

  const updateData: Record<string, any> = {}
  if (data.name !== undefined) updateData.name = data.name
  if (data.description !== undefined) updateData.description = data.description
  if (data.bannerUrl !== undefined) updateData.banner_url = data.bannerUrl
  if (data.bannerStoragePath !== undefined) updateData.banner_storage_path = data.bannerStoragePath
  if (data.isActive !== undefined) updateData.is_active = data.isActive

  const { data: program, error } = await supabase
    .from("training_programs")
    .update(updateData)
    .eq("id", programId)
    .eq("coach_id", auth.user.id)
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, program }
}

export async function deleteTrainingProgram(programId: string) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()

  // Check for active client assignments
  const { data: assignments } = await supabase
    .from("client_programs")
    .select("id")
    .eq("program_id", programId)
    .eq("status", "active")
    .limit(1)

  if (assignments && assignments.length > 0) {
    return { success: false, error: "Kan niet verwijderen: programma is toegewezen aan actieve clients" }
  }

  const { error } = await supabase
    .from("training_programs")
    .delete()
    .eq("id", programId)
    .eq("coach_id", auth.user.id)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ============================================
// BANNER UPLOAD
// ============================================

export async function uploadProgramBanner(formData: FormData) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const file = formData.get("file") as File
  if (!file) return { success: false, error: "Geen bestand geselecteerd" }

  const supabase = getSupabaseAdmin()
  const ext = file.name.split(".").pop()
  const fileName = `${auth.user.id}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from("program-banners")
    .upload(fileName, file, { upsert: true })

  if (uploadError) return { success: false, error: uploadError.message }

  const { data: { publicUrl } } = supabase.storage
    .from("program-banners")
    .getPublicUrl(fileName)

  return { success: true, url: publicUrl, storagePath: fileName }
}

// ============================================
// BLOCKS
// ============================================

export async function createProgramBlock(data: {
  programId: string
  name: string
  description?: string
  durationWeeks?: number
  orderIndex?: number
}) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()

  // Verify program ownership
  const { data: program } = await supabase
    .from("training_programs")
    .select("id")
    .eq("id", data.programId)
    .eq("coach_id", auth.user.id)
    .single()

  if (!program) return { success: false, error: "Programma niet gevonden" }

  // Get next order index if not provided
  let orderIndex = data.orderIndex
  if (orderIndex === undefined) {
    const { data: blocks } = await supabase
      .from("program_blocks")
      .select("order_index")
      .eq("program_id", data.programId)
      .order("order_index", { ascending: false })
      .limit(1)
    orderIndex = blocks && blocks.length > 0 ? blocks[0].order_index + 1 : 0
  }

  const { data: block, error } = await supabase
    .from("program_blocks")
    .insert({
      program_id: data.programId,
      name: data.name,
      description: data.description || null,
      duration_weeks: data.durationWeeks || 4,
      order_index: orderIndex,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, block }
}

export async function updateProgramBlock(blockId: string, data: {
  name?: string
  description?: string
  durationWeeks?: number
}) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()

  const updateData: Record<string, any> = {}
  if (data.name !== undefined) updateData.name = data.name
  if (data.description !== undefined) updateData.description = data.description
  if (data.durationWeeks !== undefined) updateData.duration_weeks = data.durationWeeks

  const { data: block, error } = await supabase
    .from("program_blocks")
    .update(updateData)
    .eq("id", blockId)
    .select("*, training_programs!inner(coach_id)")
    .single()

  if (error) return { success: false, error: error.message }
  if ((block as any).training_programs?.coach_id !== auth.user.id) {
    return { success: false, error: "Niet geautoriseerd" }
  }

  return { success: true, block }
}

export async function deleteProgramBlock(blockId: string) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()

  // Verify ownership via program
  const { data: block } = await supabase
    .from("program_blocks")
    .select("id, program_id, training_programs!inner(coach_id)")
    .eq("id", blockId)
    .single()

  if (!block || (block as any).training_programs?.coach_id !== auth.user.id) {
    return { success: false, error: "Niet gevonden of niet geautoriseerd" }
  }

  const { error } = await supabase
    .from("program_blocks")
    .delete()
    .eq("id", blockId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function reorderProgramBlocks(programId: string, blockIds: string[]) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()

  // Verify ownership
  const { data: program } = await supabase
    .from("training_programs")
    .select("id")
    .eq("id", programId)
    .eq("coach_id", auth.user.id)
    .single()

  if (!program) return { success: false, error: "Programma niet gevonden" }

  // Update order_index for each block
  const updates = blockIds.map((id, index) =>
    supabase
      .from("program_blocks")
      .update({ order_index: index })
      .eq("id", id)
      .eq("program_id", programId)
  )

  await Promise.all(updates)
  return { success: true }
}

// ============================================
// BLOCK WORKOUTS
// ============================================

export async function addWorkoutToBlock(data: {
  blockId: string
  workoutTemplateId: string
  dayOfWeek?: number
  notes?: string
  orderIndex?: number
}) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()

  // Verify block ownership
  const { data: block } = await supabase
    .from("program_blocks")
    .select("id, program_id, training_programs!inner(coach_id)")
    .eq("id", data.blockId)
    .single()

  if (!block || (block as any).training_programs?.coach_id !== auth.user.id) {
    return { success: false, error: "Niet geautoriseerd" }
  }

  // Get next order index if not provided
  let orderIndex = data.orderIndex
  if (orderIndex === undefined) {
    const { data: workouts } = await supabase
      .from("block_workouts")
      .select("order_index")
      .eq("block_id", data.blockId)
      .order("order_index", { ascending: false })
      .limit(1)
    orderIndex = workouts && workouts.length > 0 ? workouts[0].order_index + 1 : 0
  }

  const { data: bw, error } = await supabase
    .from("block_workouts")
    .insert({
      block_id: data.blockId,
      workout_template_id: data.workoutTemplateId,
      order_index: orderIndex,
      day_of_week: data.dayOfWeek || null,
      notes: data.notes || null,
    })
    .select(`
      *,
      workout_templates (
        id, name, description, duration_minutes,
        workout_template_exercises (
          id, order_index,
          exercises ( id, name, category )
        )
      )
    `)
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, blockWorkout: bw }
}

export async function removeWorkoutFromBlock(blockWorkoutId: string) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()

  const { error } = await supabase
    .from("block_workouts")
    .delete()
    .eq("id", blockWorkoutId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function reorderBlockWorkouts(blockId: string, workoutIds: string[]) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()

  const updates = workoutIds.map((id, index) =>
    supabase
      .from("block_workouts")
      .update({ order_index: index })
      .eq("id", id)
      .eq("block_id", blockId)
  )

  await Promise.all(updates)
  return { success: true }
}

// ============================================
// CLIENT PROGRAM ASSIGNMENTS
// ============================================

export async function assignProgramToClient(data: {
  clientId: string
  programId: string
  startDate: string
  notes?: string
}) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()

  // Verify program ownership
  const { data: program } = await supabase
    .from("training_programs")
    .select(`
      id, name,
      program_blocks (
        id, name, order_index, duration_weeks,
        block_workouts (
          id, workout_template_id, order_index, day_of_week
        )
      )
    `)
    .eq("id", data.programId)
    .eq("coach_id", auth.user.id)
    .single()

  if (!program) return { success: false, error: "Programma niet gevonden" }

  // Create client_program assignment
  const { data: assignment, error: assignError } = await supabase
    .from("client_programs")
    .insert({
      client_id: data.clientId,
      coach_id: auth.user.id,
      program_id: data.programId,
      start_date: data.startDate,
      current_block_index: 0,
      status: "active",
      notes: data.notes || null,
    })
    .select()
    .single()

  if (assignError) return { success: false, error: assignError.message }

  // Auto-create client_workouts for the first block
  const blocks = (program.program_blocks || []).sort(
    (a: any, b: any) => a.order_index - b.order_index
  )

  if (blocks.length > 0) {
    const firstBlock = blocks[0]
    const workouts = (firstBlock.block_workouts || []).sort(
      (a: any, b: any) => a.order_index - b.order_index
    )

    const startDate = new Date(data.startDate)
    const clientWorkouts = workouts.map((bw: any, index: number) => {
      const scheduledDate = new Date(startDate)
      if (bw.day_of_week) {
        // Calculate date for specific day of week
        const currentDay = startDate.getDay() || 7 // 1=Mon ... 7=Sun
        let diff = bw.day_of_week - currentDay
        if (diff < 0) diff += 7
        scheduledDate.setDate(startDate.getDate() + diff)
      } else {
        // Sequential: one per day starting from start_date
        scheduledDate.setDate(startDate.getDate() + index)
      }

      return {
        client_id: data.clientId,
        coach_id: auth.user.id,
        workout_template_id: bw.workout_template_id,
        scheduled_date: scheduledDate.toISOString().split("T")[0],
        completed: false,
        client_program_id: assignment.id,
      }
    })

    if (clientWorkouts.length > 0) {
      await supabase.from("client_workouts").insert(clientWorkouts)
    }
  }

  // Log coaching event
  try {
    const { logCoachingEventDirect } = await import("./coaching-events")
    await logCoachingEventDirect(supabase, {
      clientId: data.clientId,
      coachId: auth.user.id,
      eventType: "training_program_assigned",
      area: "training",
      title: `Programma "${program.name}" toegewezen`,
      description: `Start: ${data.startDate}, ${blocks.length} blok(ken)`,
      source: "manual",
      relatedEntityType: "training_program",
      relatedEntityId: data.programId,
      eventData: { programName: program.name, startDate: data.startDate, blocks: blocks.length },
    })
  } catch (e) { /* non-critical */ }

  return { success: true, assignment }
}

export async function getClientPrograms(clientId?: string) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()

  let query = supabase
    .from("client_programs")
    .select(`
      *,
      training_programs (
        id, name, description, banner_url, is_active,
        program_blocks ( id, name, description, order_index, duration_weeks )
      )
    `)
    .eq("coach_id", auth.user.id)
    .order("created_at", { ascending: false })

  if (clientId) {
    query = query.eq("client_id", clientId)
  }

  const { data, error } = await query

  if (error) return { success: false, error: error.message }
  return { success: true, assignments: data }
}

export async function updateClientProgramStatus(assignmentId: string, status: "active" | "paused" | "completed") {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from("client_programs")
    .update({ status })
    .eq("id", assignmentId)
    .eq("coach_id", auth.user.id)
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, assignment: data }
}

export async function removeClientProgram(assignmentId: string) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()

  // Delete related client_workouts first
  await supabase
    .from("client_workouts")
    .delete()
    .eq("client_program_id", assignmentId)

  // Delete the assignment
  const { error } = await supabase
    .from("client_programs")
    .delete()
    .eq("id", assignmentId)
    .eq("coach_id", auth.user.id)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function advanceClientBlock(assignmentId: string) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()

  // Get current assignment with program details
  const { data: assignment } = await supabase
    .from("client_programs")
    .select(`
      *,
      training_programs (
        id,
        program_blocks (
          id, name, order_index, duration_weeks,
          block_workouts ( id, workout_template_id, order_index, day_of_week )
        )
      )
    `)
    .eq("id", assignmentId)
    .eq("coach_id", auth.user.id)
    .single()

  if (!assignment) return { success: false, error: "Toewijzing niet gevonden" }

  const blocks = ((assignment as any).training_programs?.program_blocks || []).sort(
    (a: any, b: any) => a.order_index - b.order_index
  )

  const nextIndex = assignment.current_block_index + 1

  if (nextIndex >= blocks.length) {
    // All blocks completed — mark program as completed
    await supabase
      .from("client_programs")
      .update({ status: "completed" })
      .eq("id", assignmentId)
    return { success: true, completed: true }
  }

  // Advance to next block
  const { error: updateError } = await supabase
    .from("client_programs")
    .update({ current_block_index: nextIndex })
    .eq("id", assignmentId)

  if (updateError) return { success: false, error: updateError.message }

  // Create client_workouts for the next block
  const nextBlock = blocks[nextIndex]
  const workouts = (nextBlock.block_workouts || []).sort(
    (a: any, b: any) => a.order_index - b.order_index
  )

  const startDate = new Date()
  const clientWorkouts = workouts.map((bw: any, index: number) => {
    const scheduledDate = new Date(startDate)
    if (bw.day_of_week) {
      const currentDay = startDate.getDay() || 7
      let diff = bw.day_of_week - currentDay
      if (diff < 0) diff += 7
      scheduledDate.setDate(startDate.getDate() + diff)
    } else {
      scheduledDate.setDate(startDate.getDate() + index)
    }

    return {
      client_id: assignment.client_id,
      coach_id: auth.user.id,
      workout_template_id: bw.workout_template_id,
      scheduled_date: scheduledDate.toISOString().split("T")[0],
      completed: false,
      client_program_id: assignmentId,
    }
  })

  if (clientWorkouts.length > 0) {
    await supabase.from("client_workouts").insert(clientWorkouts)
  }

  return { success: true, completed: false, newBlockIndex: nextIndex }
}

// ============================================
// SAVE PROGRAM FROM BUILDER (complete flow)
// ============================================

export async function saveProgramFromBuilder(data: {
  name: string
  description?: string
  tags?: string
  bannerUrl?: string
  bannerStoragePath?: string
  useBlocks: boolean
  blocks: Array<{
    name: string
    description?: string
    durationWeeks: number
    days: Array<{
      name: string
      isRestDay: boolean
      instructions?: string
      dayOfWeek?: number
      exercises: Array<{
        exerciseId: string
        section: 'warm_up' | 'workout' | 'cool_down'
        sets?: number
        reps?: string
        restSeconds?: number
        notes?: string
        intensityType?: string
        prescribedWeightKg?: number
        prescribedRpe?: number
        prescribedRir?: number
        prescribedPercentage?: number
        tempo?: string
      }>
    }>
  }>
}) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()

  try {
    // 1. Create training program
    const { data: program, error: programError } = await supabase
      .from("training_programs")
      .insert({
        coach_id: auth.user.id,
        name: data.name,
        description: data.description || null,
        banner_url: data.bannerUrl || null,
        banner_storage_path: data.bannerStoragePath || null,
        tags: data.tags || null,
      })
      .select("id")
      .single()

    if (programError || !program) {
      return { success: false, error: programError?.message || "Fout bij aanmaken programma" }
    }

    // 2. For each block
    for (let bi = 0; bi < data.blocks.length; bi++) {
      const block = data.blocks[bi]

      const { data: savedBlock, error: blockError } = await supabase
        .from("program_blocks")
        .insert({
          program_id: program.id,
          name: block.name,
          description: block.description || null,
          duration_weeks: block.durationWeeks,
          order_index: bi,
        })
        .select("id")
        .single()

      if (blockError || !savedBlock) continue

      // 3. For each day in the block
      for (let di = 0; di < block.days.length; di++) {
        const day = block.days[di]

        // Skip rest days — no workout template needed
        if (day.isRestDay || day.exercises.length === 0) continue

        // Create workout template for this day
        const { data: template, error: templateError } = await supabase
          .from("workout_templates")
          .insert({
            coach_id: auth.user.id,
            name: day.name || `${data.name} - Day ${di + 1}`,
            description: day.instructions || null,
          })
          .select("id")
          .single()

        if (templateError || !template) continue

        // Create workout_template_exercises
        const exerciseRows = day.exercises.map((ex, ei) => ({
          workout_template_id: template.id,
          exercise_id: ex.exerciseId,
          order_index: ei,
          sets: ex.sets || null,
          reps: ex.reps || null,
          rest_seconds: ex.restSeconds || null,
          notes: ex.notes || null,
          intensity_type: ex.intensityType || "weight",
          prescribed_weight_kg: ex.prescribedWeightKg || null,
          prescribed_rpe: ex.prescribedRpe || null,
          prescribed_rir: ex.prescribedRir || null,
          prescribed_percentage: ex.prescribedPercentage || null,
          tempo: ex.tempo || null,
          section: ex.section || "workout",
        }))

        if (exerciseRows.length > 0) {
          await supabase
            .from("workout_template_exercises")
            .insert(exerciseRows)
        }

        // Link to block via block_workout
        await supabase
          .from("block_workouts")
          .insert({
            block_id: savedBlock.id,
            workout_template_id: template.id,
            order_index: di,
            day_of_week: day.dayOfWeek || null,
            notes: day.instructions || null,
          })
      }
    }

    return { success: true, programId: program.id }
  } catch (err: any) {
    return { success: false, error: err.message || "Er is een fout opgetreden" }
  }
}

// ============================================
// COACH'S WORKOUT TEMPLATES (for block builder dropdown)
// ============================================

export async function getWorkoutTemplatesForProgram() {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("workout_templates")
    .select(`
      id, name, description, duration_minutes,
      workout_template_exercises (
        id, order_index,
        exercises ( id, name, category )
      )
    `)
    .eq("coach_id", auth.user.id)
    .order("name")

  if (error) return { success: false, error: error.message }
  return { success: true, templates: data }
}

// ============================================
// COACH'S CLIENTS (for assign dropdown)
// ============================================

export async function getCoachClients() {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()

  // Step 1: Get active coaching relationships for this coach
  const { data: relationships, error: relError } = await supabase
    .from("coaching_relationships")
    .select("client_id")
    .eq("coach_id", auth.user.id)
    .eq("status", "ACTIVE")

  if (relError) return { success: false, error: relError.message }

  const clientIds = (relationships || []).map((r: any) => r.client_id)
  if (clientIds.length === 0) return { success: true, clients: [] }

  // Step 2: Get profiles for those client IDs
  const { data: profiles, error: profError } = await supabase
    .from("profiles")
    .select("user_id, first_name, last_name")
    .in("user_id", clientIds)

  if (profError) return { success: false, error: profError.message }

  const clients = (profiles || []).map((p: any) => ({
    id: p.user_id,
    fullName: [p.first_name, p.last_name].filter(Boolean).join(" ") || "Onbekend",
  }))

  return { success: true, clients }
}
