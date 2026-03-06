import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import api from '@/api'
import type { Project, ApiResponse } from '@/types'

export const useProjectStore = defineStore('project', () => {
  const projects: Ref<Project[]> = ref([])
  const currentProject: Ref<Project | null> = ref(null)
  const isLoading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)

  const getProjects = async (): Promise<Project[]> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.get<ApiResponse<Project[]>>('/projects')
      projects.value = response.data.data
      return projects.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch projects'
      return []
    } finally {
      isLoading.value = false
    }
  }

  const getProjectById = async (id: number): Promise<Project | null> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.get<ApiResponse<Project>>(`/project/${id}`)
      currentProject.value = response.data.data
      return currentProject.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch project'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const createProject = async (projectData: Partial<Project>): Promise<Project | null> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.post<ApiResponse<Project>>('/create-project', projectData)
      const newProject = response.data.data
      projects.value.push(newProject)
      return newProject
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create project'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const updateProject = async (id: number, projectData: Partial<Project>): Promise<Project | null> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.patch<ApiResponse<Project>>(`/update-project/${id}`, projectData)
      const updatedProject = response.data.data
      
      const index = projects.value.findIndex(p => p.id === id)
      if (index !== -1) {
        projects.value[index] = updatedProject
      }
      
      if (currentProject.value?.id === id) {
        currentProject.value = updatedProject
      }
      
      return updatedProject
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update project'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const clearError = (): void => {
    error.value = null
  }

  return {
    projects,
    currentProject,
    isLoading,
    error,
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    clearError,
  }
})
