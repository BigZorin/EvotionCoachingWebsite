"use client"

import { useCallback, useEffect, useRef } from "react"

interface AnimationTask {
  id: string
  callback: (deltaTime: number, timestamp: number) => boolean | void
  priority: number
}

class AnimationManager {
  private tasks: Map<string, AnimationTask> = new Map()
  private isRunning = false
  private lastTimestamp = 0
  private frameId: number | null = null
  private performanceMonitor = {
    frameCount: 0,
    lastFpsUpdate: 0,
    currentFps: 60,
    averageFrameTime: 16.67,
  }

  private tick = (timestamp: number) => {
    const deltaTime = timestamp - this.lastTimestamp
    this.lastTimestamp = timestamp

    // Performance monitoring
    this.performanceMonitor.frameCount++
    if (timestamp - this.performanceMonitor.lastFpsUpdate >= 1000) {
      this.performanceMonitor.currentFps = this.performanceMonitor.frameCount
      this.performanceMonitor.averageFrameTime = 1000 / this.performanceMonitor.currentFps
      this.performanceMonitor.frameCount = 0
      this.performanceMonitor.lastFpsUpdate = timestamp
    }

    // Skip frame if performance is poor
    if (deltaTime > 32) {
      // More than 2 frames behind
      this.frameId = requestAnimationFrame(this.tick)
      return
    }

    // Execute tasks by priority
    const sortedTasks = Array.from(this.tasks.values()).sort((a, b) => b.priority - a.priority)

    for (const task of sortedTasks) {
      try {
        const shouldContinue = task.callback(deltaTime, timestamp)
        if (shouldContinue === false) {
          this.tasks.delete(task.id)
        }
      } catch (error) {
        console.warn(`Animation task ${task.id} failed:`, error)
        this.tasks.delete(task.id)
      }
    }

    if (this.tasks.size > 0) {
      this.frameId = requestAnimationFrame(this.tick)
    } else {
      this.isRunning = false
    }
  }

  addTask(id: string, callback: AnimationTask["callback"], priority = 0) {
    this.tasks.set(id, { id, callback, priority })

    if (!this.isRunning) {
      this.isRunning = true
      this.lastTimestamp = performance.now()
      this.frameId = requestAnimationFrame(this.tick)
    }
  }

  removeTask(id: string) {
    this.tasks.delete(id)

    if (this.tasks.size === 0 && this.frameId) {
      cancelAnimationFrame(this.frameId)
      this.isRunning = false
    }
  }

  getPerformanceStats() {
    return { ...this.performanceMonitor }
  }

  cleanup() {
    this.tasks.clear()
    if (this.frameId) {
      cancelAnimationFrame(this.frameId)
      this.frameId = null
    }
    this.isRunning = false
  }
}

const globalAnimationManager = new AnimationManager()

export function useAnimationManager() {
  const taskIds = useRef<Set<string>>(new Set())
  const idMapping = useRef<Map<string, Set<string>>>(new Map())

  /**
   * Registers an animation callback.
   * Returns the unique animation id and a cleanup function.
   * The returned id can be used with `removeAnimation` to stop the
   * animation manually.
   */
  const addAnimation = useCallback(
    (id: string, callback: AnimationTask["callback"], priority = 0) => {
      const uniqueId = `${id}-${Math.random().toString(36).substr(2, 9)}`
      taskIds.current.add(uniqueId)
      globalAnimationManager.addTask(uniqueId, callback, priority)

      if (!idMapping.current.has(id)) {
        idMapping.current.set(id, new Set())
      }
      idMapping.current.get(id)!.add(uniqueId)

      const cleanup = () => {
        taskIds.current.delete(uniqueId)
        globalAnimationManager.removeTask(uniqueId)
        const set = idMapping.current.get(id)
        if (set) {
          set.delete(uniqueId)
          if (set.size === 0) {
            idMapping.current.delete(id)
          }
        }
      }

      return { id: uniqueId, cleanup }
    },
    [],
  )

  /**
   * Removes an animation. Accepts either the unique id returned from
   * `addAnimation` or the external id to remove all associated animations.
   */
  const removeAnimation = useCallback((id: string) => {
    if (idMapping.current.has(id)) {
      const ids = idMapping.current.get(id)!
      ids.forEach((uid) => {
        globalAnimationManager.removeTask(uid)
        taskIds.current.delete(uid)
      })
      idMapping.current.delete(id)
    } else {
      globalAnimationManager.removeTask(id)
      taskIds.current.delete(id)
      idMapping.current.forEach((set, key) => {
        if (set.delete(id) && set.size === 0) {
          idMapping.current.delete(key)
        }
      })
    }
  }, [])

  const getStats = useCallback(() => {
    return globalAnimationManager.getPerformanceStats()
  }, [])

  useEffect(() => {
    return () => {
      // Cleanup all tasks when component unmounts
      taskIds.current.forEach((id) => {
        removeAnimation(id)
      })
      taskIds.current.clear()
    }
  }, [removeAnimation])

  return { addAnimation, removeAnimation, getStats }
}
