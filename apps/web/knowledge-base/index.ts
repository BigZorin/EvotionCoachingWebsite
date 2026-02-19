import fs from 'fs'
import path from 'path'

/**
 * Load all knowledge base markdown files into a single string
 * This content is used to provide context to the AI for workout generation
 */
export function loadKnowledgeBase(): string {
  const baseDir = path.join(process.cwd(), 'knowledge-base')

  const files = [
    'fnms-sam-miller/programming-principles.md',
    'fnms-sam-miller/exercise-selection.md',
    'henselmans-pt/muscle-hypertrophy.md',
    'henselmans-pt/program-design.md',
    'coaching-concierge/program-progression.md',
  ]

  try {
    const content = files
      .map((file) => {
        const filePath = path.join(baseDir, file)
        if (fs.existsSync(filePath)) {
          return fs.readFileSync(filePath, 'utf-8')
        }
        return `# ${file}\n\n_Content not yet added_`
      })
      .join('\n\n---\n\n')

    return content
  } catch (error) {
    console.error('Error loading knowledge base:', error)
    return '# Knowledge Base\n\n_Error loading knowledge base content_'
  }
}

/**
 * Get a summary of the knowledge base (for debugging/logging)
 */
export function getKnowledgeBaseSummary(): {
  totalFiles: number
  totalCharacters: number
  files: string[]
} {
  const content = loadKnowledgeBase()
  const files = [
    'fnms-sam-miller/programming-principles.md',
    'fnms-sam-miller/exercise-selection.md',
    'henselmans-pt/muscle-hypertrophy.md',
    'henselmans-pt/program-design.md',
    'coaching-concierge/program-progression.md',
  ]

  return {
    totalFiles: files.length,
    totalCharacters: content.length,
    files,
  }
}
