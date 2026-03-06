<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-2xl p-8 animate-slideIn">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold">
            <span class="text-gray-900">Task</span><span class="text-blue-600">Tracker</span>
          </h1>
          <p class="text-gray-500 text-sm mt-2">Masuk ke akun kamu</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              v-model="email"
              type="email"
              required
              class="input-field"
              placeholder="admin@energeek.id"
              :disabled="isLoading"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              v-model="password"
              type="password"
              required
              class="input-field"
              placeholder="••••••••"
              :disabled="isLoading"
            />
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>

          <button
            type="submit"
            class="w-full btn btn-primary py-3 text-base font-semibold"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Masuk</span>
            <span v-else>Loading...</span>
          </button>
        </form>

        <p class="text-center text-gray-600 text-sm mt-6">
          Demo credentials: admin@energeek.id / password
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const email = ref<string>('admin@energeek.id')
const password = ref<string>('')
const isLoading = ref<boolean>(false)
const error = ref<string>('')

const handleLogin = async (): Promise<void> => {
  error.value = ''
  isLoading.value = true

  const success = await authStore.login(email.value, password.value)
  
  if (success) {
    router.push('/')
  } else {
    error.value = authStore.error || 'Login gagal. Silakan coba lagi.'
  }
  
  isLoading.value = false
}
</script>
