"use server"

import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

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
  if (!user) return { authorized: false, user: null }
  const role = user.user_metadata?.role || 'CLIENT'
  if (role !== 'ADMIN' && role !== 'COACH') return { authorized: false, user: null }
  return { authorized: true, user }
}

async function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

// Types
export interface TemplateQuestion {
  id: string
  template_id: string
  question: string
  question_type: "scale" | "number" | "text" | "yes_no" | "multiple_choice"
  options: string[] | null
  scale_labels: string[] | null
  is_required: boolean
  order_index: number
  field_key: string | null
  unit: string | null
}

export interface CheckInTemplate {
  id: string
  coach_id: string
  name: string
  description: string | null
  check_in_type: "daily" | "weekly"
  is_default: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  questions?: TemplateQuestion[]
  assignment_count?: number
}

export interface TemplateAssignment {
  id: string
  template_id: string
  client_id: string
  assigned_at: string
}

// Get all templates for the current coach
export async function getCoachTemplates() {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()
  const { data, error } = await supabase
    .from("check_in_templates")
    .select("*, template_questions(*)")
    .eq("coach_id", auth.user.id)
    .order("created_at", { ascending: false })

  if (error) return { success: false, error: error.message }

  // Count assignments per template
  const templates = (data || []).map((t: any) => ({
    ...t,
    questions: t.template_questions || [],
  }))

  return { success: true, templates: templates as CheckInTemplate[] }
}

// Get single template with questions
export async function getTemplate(templateId: string) {
  const auth = await checkAuth()
  if (!auth.authorized) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()
  const { data, error } = await supabase
    .from("check_in_templates")
    .select("*, template_questions(*)")
    .eq("id", templateId)
    .single()

  if (error) return { success: false, error: error.message }

  return {
    success: true,
    template: {
      ...data,
      questions: (data.template_questions || []).sort(
        (a: any, b: any) => a.order_index - b.order_index
      ),
    } as CheckInTemplate,
  }
}

// Create template with questions
export async function createTemplate(input: {
  name: string
  description?: string
  checkInType: "daily" | "weekly"
  isDefault: boolean
  questions: {
    question: string
    questionType: "scale" | "number" | "text" | "yes_no" | "multiple_choice"
    options?: string[]
    scaleLabels?: string[]
    isRequired: boolean
    fieldKey?: string
    unit?: string
  }[]
}) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()

  // If this is set as default, unset other defaults of same type
  if (input.isDefault) {
    await supabase
      .from("check_in_templates")
      .update({ is_default: false })
      .eq("coach_id", auth.user.id)
      .eq("check_in_type", input.checkInType)
      .eq("is_default", true)
  }

  // Create template
  const { data: template, error: templateError } = await supabase
    .from("check_in_templates")
    .insert({
      coach_id: auth.user.id,
      name: input.name,
      description: input.description || null,
      check_in_type: input.checkInType,
      is_default: input.isDefault,
    })
    .select()
    .single()

  if (templateError) return { success: false, error: templateError.message }

  // Create questions
  if (input.questions.length > 0) {
    const questionPayload = input.questions.map((q, index) => ({
      template_id: template.id,
      question: q.question,
      question_type: q.questionType,
      options: q.options || null,
      scale_labels: q.scaleLabels || null,
      is_required: q.isRequired,
      order_index: index,
      field_key: q.fieldKey || null,
      unit: q.unit || null,
    }))

    const { error: questionsError } = await supabase
      .from("template_questions")
      .insert(questionPayload)

    if (questionsError) return { success: false, error: questionsError.message }
  }

  return { success: true, templateId: template.id }
}

// Update template
export async function updateTemplate(
  templateId: string,
  input: {
    name?: string
    description?: string
    isDefault?: boolean
    isActive?: boolean
  }
) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()

  const updatePayload: any = {}
  if (input.name !== undefined) updatePayload.name = input.name
  if (input.description !== undefined) updatePayload.description = input.description
  if (input.isActive !== undefined) updatePayload.is_active = input.isActive
  if (input.isDefault !== undefined) {
    updatePayload.is_default = input.isDefault
    // Unset other defaults if setting as default
    if (input.isDefault) {
      const { data: current } = await supabase
        .from("check_in_templates")
        .select("check_in_type")
        .eq("id", templateId)
        .single()
      if (current) {
        await supabase
          .from("check_in_templates")
          .update({ is_default: false })
          .eq("coach_id", auth.user.id)
          .eq("check_in_type", current.check_in_type)
          .eq("is_default", true)
          .neq("id", templateId)
      }
    }
  }

  const { error } = await supabase
    .from("check_in_templates")
    .update(updatePayload)
    .eq("id", templateId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// Delete template
export async function deleteTemplate(templateId: string) {
  const auth = await checkAuth()
  if (!auth.authorized) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()
  const { error } = await supabase
    .from("check_in_templates")
    .delete()
    .eq("id", templateId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// Assign template to client
export async function assignTemplateToClient(templateId: string, clientId: string) {
  const auth = await checkAuth()
  if (!auth.authorized) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()

  // Remove existing assignment for same template (if any)
  await supabase
    .from("check_in_template_assignments")
    .delete()
    .eq("client_id", clientId)
    .eq("template_id", templateId)

  const { error } = await supabase
    .from("check_in_template_assignments")
    .insert({ template_id: templateId, client_id: clientId })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// Remove template assignment from client
export async function removeTemplateAssignment(templateId: string, clientId: string) {
  const auth = await checkAuth()
  if (!auth.authorized) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()
  const { error } = await supabase
    .from("check_in_template_assignments")
    .delete()
    .eq("template_id", templateId)
    .eq("client_id", clientId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// Get assignments for a template
export async function getTemplateAssignments(templateId: string) {
  const auth = await checkAuth()
  if (!auth.authorized) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()
  const { data, error } = await supabase
    .from("check_in_template_assignments")
    .select("*")
    .eq("template_id", templateId)

  if (error) return { success: false, error: error.message }
  return { success: true, assignments: data as TemplateAssignment[] }
}

// Get template assignments for a specific client (with template data)
export async function getClientTemplateAssignments(clientId: string) {
  const auth = await checkAuth()
  if (!auth.authorized) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()
  const { data, error } = await supabase
    .from("check_in_template_assignments")
    .select("*, check_in_templates(*, template_questions(*))")
    .eq("client_id", clientId)

  if (error) return { success: false, error: error.message }

  const assignments = (data || []).map((a: any) => ({
    id: a.id,
    template_id: a.template_id,
    client_id: a.client_id,
    assigned_at: a.assigned_at,
    template: a.check_in_templates ? {
      ...a.check_in_templates,
      questions: (a.check_in_templates.template_questions || []).sort(
        (x: any, y: any) => x.order_index - y.order_index
      ),
    } : null,
  }))

  return { success: true, assignments }
}

// Get client's check-in answers for a specific check-in
export async function getCheckInAnswers(checkInId: string) {
  const auth = await checkAuth()
  if (!auth.authorized) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()
  const { data, error } = await supabase
    .from("check_in_answers")
    .select("*, template_questions(question, question_type)")
    .eq("check_in_id", checkInId)

  if (error) return { success: false, error: error.message }
  return { success: true, answers: data }
}
