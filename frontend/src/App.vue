<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/authStore'
import type { User } from './types'

const authStore = useAuthStore()

onMounted(() => {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  
  if (token && user) {
    authStore.setUser(JSON.parse(user) as User)
    authStore.setToken(token)
  }
})
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
