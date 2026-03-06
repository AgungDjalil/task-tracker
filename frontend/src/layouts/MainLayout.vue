<template>
  <div class="flex h-screen bg-gray-50">
    <div class="w-64 bg-slate-900 text-white shadow-lg flex flex-col">
      <div class="p-6 border-b border-slate-700">
        <h1 class="text-2xl font-bold">
          <span>Task</span><span class="text-blue-400">Tracker</span>
        </h1>
      </div>
      <nav class="flex-1 overflow-y-auto p-4">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200"
          :class="{
            'bg-blue-600': isActive(item.path),
            'hover:bg-slate-800': !isActive(item.path)
          }"
        >
          <span class="text-xl">{{ item.icon }}</span>
          <span class="font-medium">{{ item.label }}</span>
        </router-link>
      </nav>
      <div class="p-4 border-t border-slate-700">
        <div class="flex items-center space-x-3 mb-4 p-3 bg-slate-800 rounded-lg">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            {{ authStore.user?.name?.[0]?.toUpperCase() || 'A' }}
          </div>
          <div class="flex-1">
            <p class="text-sm font-semibold">{{ authStore.user?.name || 'Admin' }}</p>
            <p class="text-xs text-gray-400">{{ authStore.user?.email || 'admin@energeek.id' }}</p>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 text-sm font-medium"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
    <div class="flex-1 flex flex-col overflow-hidden">
      <div class="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">{{ currentPageTitle }}</h2>
          <div class="text-sm text-gray-500">
            {{ new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
          </div>
        </div>
      </div>
      <div class="flex-1 overflow-auto">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

interface NavItem {
  path: string
  label: string
  icon: string
}

const navItems: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/projects', label: 'Project', icon: '📁' },
  { path: '/tasks', label: 'Task', icon: '✓' },
]

const pageTitle: Record<string, string> = {
  '/': 'Dashboard',
  '/projects': 'Project',
  '/tasks': 'Task',
}

const currentPageTitle = computed(() => {
  return pageTitle[route.path] || 'Dashboard'
})

const isActive = (path: string): boolean => {
  return route.path === path || route.path.startsWith(path + '/')
}

const handleLogout = async (): Promise<void> => {
  if (confirm('Apakah Anda yakin ingin logout?')) {
    await authStore.logout()
    router.push('/login')
  }
}
</script>
