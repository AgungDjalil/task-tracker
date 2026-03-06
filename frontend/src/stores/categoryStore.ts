import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import api from '@/api'
import type { Category, ApiResponse } from '@/types'

export const useCategoryStore = defineStore('category', () => {
  const categories: Ref<Category[]> = ref([])
  const isLoading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)

  const getCategories = async (): Promise<Category[]> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.get<ApiResponse<Category[]>>('/categories')
      categories.value = response.data.data
      return categories.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch categories'
      return []
    } finally {
      isLoading.value = false
    }
  }

  const clearError = (): void => {
    error.value = null
  }

  return {
    categories,
    isLoading,
    error,
    getCategories,
    clearError,
  }
})
