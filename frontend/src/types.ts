// User Types
export interface User {
  id: number
  name: string
  email: string
  is_admin?: boolean
  created_at?: string
  updated_at?: string
}

// Project Types
export interface Project {
  id: number
  name: string
  description: string
  status: 'active' | 'archived'
  created_by: number
  task_count?: number
  created_at?: string
  updated_at?: string
  tasks?: Task[]
}

export interface Category {
  id: number
  name: string
}

// Task Types
export interface Task {
  id: number
  title: string
  description: string
  due_date: string
  project_id: number
  category_id: number
  created_by: number
  created_at?: string
  updated_at?: string
  project?: Project
  category?: Category
}

// Category Types
export interface Category {
  id: number
  name: string
  created_at?: string
  updated_at?: string
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface LoginResponse {
  data: {
    name: string
    email: string
  }
  token: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  per_page: number
  current_page: number
}
