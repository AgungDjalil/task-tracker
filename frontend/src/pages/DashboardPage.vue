<template>
  <div class="p-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="card p-6 flex items-center space-x-4">
        <div class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
          📁
        </div>
        <div>
          <p class="text-gray-600 text-sm">Total Projects</p>
          <p class="text-3xl font-bold text-gray-900">{{ stats.totalProjects }}</p>
        </div>
      </div>

      <div class="card p-6 flex items-center space-x-4">
        <div class="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center text-2xl">
          ⭐
        </div>
        <div>
          <p class="text-gray-600 text-sm">Total Tasks</p>
          <p class="text-3xl font-bold text-gray-900">{{ stats.totalTasks }}</p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-bold text-gray-900">Task Mendekati Due Date</h3>
      </div>
      <div class="divide-y divide-gray-200">
        <div
          v-for="task in overdueTasks"
          :key="task.id"
          class="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div class="flex-1">
            <p class="font-semibold text-gray-900">{{ task.title }}</p>
            <p class="text-sm text-gray-600">{{ task.project?.name }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm font-medium" :class="getDueDateClass(task.due_date)">
              {{ formatDate(task.due_date) }}
            </span>
            <span v-if="isOverdue(task.due_date)" class="badge badge-danger text-xs">
              {{ daysUntilDue(task.due_date) }}
            </span>
          </div>
        </div>
        <div v-if="overdueTasks.length === 0" class="p-6 text-center text-gray-500">
          Tidak ada tugas yang mendekati due date
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { useTaskStore } from '@/stores/taskStore'
import type { Task } from '@/types'

interface Stats {
  totalProjects: number
  totalTasks: number
}

const projectStore = useProjectStore()
const taskStore = useTaskStore()

const stats: Ref<Stats> = ref({
  totalProjects: 0,
  totalTasks: 0,
})

const overdueTasks = computed(() => {
  return taskStore.tasks
    .filter(task => {
      const daysUntil = daysUntilDue(task.due_date)
      return daysUntil <= 7 && daysUntil >= -30
    })
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5)
})

onMounted(async () => {
  await projectStore.getProjects()
  await taskStore.getTasks()
  
  stats.value.totalProjects = projectStore.projects.length
  stats.value.totalTasks = taskStore.tasks.length
})

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const daysUntilDue = (dateString: string): number => {
  const today = new Date()
  const dueDate = new Date(dateString)
  today.setHours(0, 0, 0, 0)
  dueDate.setHours(0, 0, 0, 0)
  const diffTime = dueDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const isOverdue = (dateString: string): boolean => {
  return daysUntilDue(dateString) < 0
}

const getDueDateClass = (dateString: string): string => {
  const days = daysUntilDue(dateString)
  if (days < 0) return 'text-red-600'
  if (days <= 3) return 'text-orange-600'
  if (days <= 7) return 'text-yellow-600'
  return 'text-green-600'
}
</script>
