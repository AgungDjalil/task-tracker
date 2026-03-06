import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import api from '@/api'
import type { Task, ApiResponse } from '@/types'

export const useTaskStore = defineStore('task', () => {
  const tasks: Ref<Task[]> = ref([])
  const tasksByProject: Ref<Task[]> = ref([])
  const currentTask: Ref<Task | null> = ref(null)
  const isLoading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)

  const getTasks = async (): Promise<Task[]> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.get<ApiResponse<Task[]>>('/tasks')
      tasks.value = response.data.data
      return tasks.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch tasks'
      return []
    } finally {
      isLoading.value = false
    }
  }

  const getTasksByProject = async (projectId: number): Promise<Task[]> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.get<ApiResponse<Task[]>>(`/tasks-by-project/${projectId}`)
      tasksByProject.value = response.data.data
      return tasksByProject.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch tasks'
      return []
    } finally {
      isLoading.value = false
    }
  }

  const createTask = async (taskData: Partial<Task>): Promise<Task | null> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.post<ApiResponse<Task>>('/create-task', taskData)
      const newTask = response.data.data
      tasks.value.push(newTask)

      if (newTask.project_id) {
        tasksByProject.value.push(newTask)
      }

      return newTask
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create task'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const updateTask = async (id: number, taskData: Partial<Task>): Promise<Task | null> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.patch<ApiResponse<Task>>(`/update-task/${id}`, taskData)
      const updatedTask = response.data.data
      
      const index = tasks.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tasks.value[index] = updatedTask
      }
      
      const projectIndex = tasksByProject.value.findIndex(t => t.id === id)
      if (projectIndex !== -1) {
        tasksByProject.value[projectIndex] = updatedTask
      }
      
      return updatedTask
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update task'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const deleteTask = async (id: number): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      await api.delete(`/tasks/${id}`)
      
      tasks.value = tasks.value.filter(t => t.id !== id)
      tasksByProject.value = tasksByProject.value.filter(t => t.id !== id)
      
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete task'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const clearError = (): void => {
    error.value = null
  }

  return {
    tasks,
    tasksByProject,
    currentTask,
    isLoading,
    error,
    getTasks,
    getTasksByProject,
    createTask,
    updateTask,
    deleteTask,
    clearError,
  }
})
