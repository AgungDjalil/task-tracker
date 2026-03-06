<template>
  <div class="p-8">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Daftar Projek</h2>
      <button
        @click="showCreateModal = true"
        class="btn btn-primary"
      >
        + Projek Baru
      </button>
    </div>

    <div v-if="projectStore.isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else class="card overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">NAMA</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">DESKRIPSI</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">STATUS</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">AKSI</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="project in projectStore.projects"
            :key="project.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 font-semibold text-gray-900">{{ project.name }}</td>
            <td class="px-6 py-4 text-gray-600 text-sm">{{ truncate(project.description, 50) }}</td>
            <td class="px-6 py-4">
              <span class="badge" :class="getStatusBadgeClass(project.status)">
                {{ project.status || 'Active' }}
              </span>
            </td>
            <td class="px-6 py-4 flex items-center space-x-2">
              <router-link
                :to="`/project/${project.id}`"
                class="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                Lihat
              </router-link>
              <button
                @click="editProject(project)"
                class="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
              >
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="projectStore.projects.length === 0" class="p-8 text-center text-gray-500">
        Tidak ada projek
      </div>
    </div>

    <transition name="modal">
      <div
        v-if="showCreateModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        @click.self="closeModal"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">
            {{ editingProject ? 'Edit Projek' : 'Buat Projek Baru' }}
          </h3>

          <form @submit.prevent="submitProject" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Nama Projek</label>
              <input
                v-model="formData.name"
                type="text"
                required
                class="input-field"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
              <textarea
                v-model="formData.description"
                class="input-field"
                rows="4"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                v-model="formData.status"
                class="input-field"
              >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div v-if="projectStore.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {{ projectStore.error }}
            </div>

            <div class="flex space-x-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="flex-1 btn btn-secondary"
              >
                Batal
              </button>
              <button
                type="submit"
                class="flex-1 btn btn-primary"
              >
                {{ editingProject ? 'Update' : 'Buat' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import type { Project } from '@/types'

const projectStore = useProjectStore()
const showCreateModal: Ref<boolean> = ref(false)
const editingProject: Ref<Project | null> = ref(null)
const formData: Ref<Partial<Project>> = ref({
  name: '',
  description: '',
  status: 'active',
})

onMounted(async () => {
  await projectStore.getProjects()
})

const truncate = (text: string, length: number): string => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const getStatusBadgeClass = (status: string): string => {
  return status === 'archived' ? 'badge-danger' : 'badge-success'
}

const editProject = (project: Project): void => {
  editingProject.value = project
  formData.value = {
    name: project.name,
    description: project.description,
    status: project.status || 'active',
  }
  showCreateModal.value = true
}

const submitProject = async (): Promise<void> => {
  if (editingProject.value && editingProject.value.id) {
    await projectStore.updateProject(editingProject.value.id, formData.value)
  } else {
    await projectStore.createProject(formData.value)
  }
  
  if (!projectStore.error) {
    closeModal()
  }
}

const closeModal = (): void => {
  showCreateModal.value = false
  editingProject.value = null
  formData.value = { name: '', description: '', status: 'active' }
  projectStore.clearError()
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
