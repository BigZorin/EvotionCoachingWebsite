import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Server-side Supabase client with service role for storage operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

/**
 * Upload an exercise video to Supabase Storage
 * @param file - The video file to upload
 * @param exerciseId - The ID of the exercise
 * @param userId - The ID of the user uploading
 * @returns Object with storagePath and publicUrl
 */
export async function uploadExerciseVideo(
  file: File,
  exerciseId: string,
  userId: string
) {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${exerciseId}/${Date.now()}.${fileExt}`

    const { data, error } = await supabaseAdmin.storage
      .from('exercise-videos')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error('Error uploading video:', error)
      throw error
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from('exercise-videos').getPublicUrl(fileName)

    return {
      success: true,
      storagePath: fileName,
      publicUrl,
    }
  } catch (error: any) {
    console.error('Error in uploadExerciseVideo:', error)
    return {
      success: false,
      error: error.message || 'Failed to upload video',
    }
  }
}

/**
 * Upload an exercise thumbnail image to Supabase Storage
 * @param file - The image file to upload
 * @param exerciseId - The ID of the exercise
 * @param userId - The ID of the user uploading
 * @returns Object with storagePath and publicUrl
 */
export async function uploadExerciseThumbnail(
  file: File,
  exerciseId: string,
  userId: string
) {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${exerciseId}/${Date.now()}.${fileExt}`

    const { data, error } = await supabaseAdmin.storage
      .from('exercise-images')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error('Error uploading thumbnail:', error)
      throw error
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from('exercise-images').getPublicUrl(fileName)

    return {
      success: true,
      storagePath: fileName,
      publicUrl,
    }
  } catch (error: any) {
    console.error('Error in uploadExerciseThumbnail:', error)
    return {
      success: false,
      error: error.message || 'Failed to upload thumbnail',
    }
  }
}

/**
 * Delete an exercise video from Supabase Storage
 * @param storagePath - The storage path of the video
 */
export async function deleteExerciseVideo(storagePath: string) {
  try {
    const { error } = await supabaseAdmin.storage
      .from('exercise-videos')
      .remove([storagePath])

    if (error) {
      console.error('Error deleting video:', error)
      throw error
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error in deleteExerciseVideo:', error)
    return {
      success: false,
      error: error.message || 'Failed to delete video',
    }
  }
}

/**
 * Delete an exercise thumbnail from Supabase Storage
 * @param storagePath - The storage path of the thumbnail
 */
export async function deleteExerciseThumbnail(storagePath: string) {
  try {
    const { error } = await supabaseAdmin.storage
      .from('exercise-images')
      .remove([storagePath])

    if (error) {
      console.error('Error deleting thumbnail:', error)
      throw error
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error in deleteExerciseThumbnail:', error)
    return {
      success: false,
      error: error.message || 'Failed to delete thumbnail',
    }
  }
}

/**
 * Get public URL for an exercise video
 * @param storagePath - The storage path of the video
 */
export function getExerciseVideoUrl(storagePath: string) {
  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from('exercise-videos').getPublicUrl(storagePath)
  return publicUrl
}

/**
 * Get public URL for an exercise thumbnail
 * @param storagePath - The storage path of the thumbnail
 */
export function getExerciseThumbnailUrl(storagePath: string) {
  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from('exercise-images').getPublicUrl(storagePath)
  return publicUrl
}
