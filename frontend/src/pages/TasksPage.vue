<template>
  <div class="p-8">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Daftar Task</h2>
      <button
        @click="showCreateModal = true"
        class="btn btn-primary"
      >
        + Task Baru
      </button>
    </div>

    <div class="flex gap-4 mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari task..."
        class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        v-model="selectedProject"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Semua Projek</option>
        <option v-for="project in projectStore.projects" :key="project.id" :value="project.id.toString()">
          {{ project.name }}
        </option>
      </select>
    </div>

    <div v-if="taskStore.isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else class="card overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">JUDUL</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">PROJEK</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">DUE DATE</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">AKSI</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="task in filteredTasks"
            :key="task.id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 font-semibold text-gray-900">{{ task.title }}</td>
            <td class="px-6 py-4 text-gray-600 text-sm">{{ task.project?.name || '-' }}</td>
            <td class="px-6 py-4 text-sm" :class="getDueDateClass(task.due_date)">
              {{ formatDate(task.due_date) }}
            </td>
            <td class="px-6 py-4 flex items-center space-x-2">
              <button
                @click="editTask(task)"
                class="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded"
              >
                Edit
              </button>
              <button
                @click="deleteTask(task.id)"
                class="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded"
              >
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredTasks.length === 0" class="p-8 text-center text-gray-500">
        Tidak ada task
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
            {{ editingTask ? 'Edit Task' : 'Buat Task Baru' }}
          </h3>

          <form @submit.prevent="submitTask" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Judul</label>
              <input
                v-model="formData.title"
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
                rows="3"
                required
              ></textarea>
            </div>

            <div class="flex gap-5">
              <div class="w-full">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select v-model="formData.category_id" required class="input-field">
                  <option :value="null">Pilih Category</option>
                  <option v-for="category in categoryStore.categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                <input
                  v-model="formData.due_date"
                  type="date"
                  required
                  class="input-field"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Projek</label>
              <select v-model="formData.project_id" required class="input-field">
                <option :value="null">Pilih Projek</option>
                <option v-for="project in projectStore.projects" :key="project.id" :value="project.id">
                  {{ project.name }}
                </option>
              </select>
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
                {{ editingTask ? 'Update' : 'Buat' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <transition name="modal">
      <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        @click.self="showDeleteConfirm = false"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Hapus Task</h3>
          <p class="text-gray-600 mb-6">
            Apakah Anda yakin ingin menghapus task ini?
          </p>
          <div class="flex space-x-3">
            <button
              @click="showDeleteConfirm = false"
              class="flex-1 btn btn-secondary"
            >
              Batal
            </button>
            <button
              @click="confirmDelete"
              class="flex-1 btn btn-danger"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { useTaskStore } from '@/stores/taskStore'
import type { Task } from '@/types'
import { useCategoryStore } from '@/stores/categoryStore'

const projectStore = useProjectStore()
const taskStore = useTaskStore()
const categoryStore = useCategoryStore()

const showCreateModal: Ref<boolean> = ref(false)
const showDeleteConfirm: Ref<boolean> = ref(false)
const editingTask: Ref<Task | null> = ref(null)
const deletingTaskId: Ref<number | null> = ref(null)
const searchQuery: Ref<string> = ref('')
const selectedProject: Ref<string> = ref('')

const formData: Ref<Partial<Task>> = ref({
  title: '',
  description: '',
  due_date: '',
  project_id: undefined,
  category_id: 1,
})

const filteredTasks: ComputedRef<Task[]> = computed(() => {
  return taskStore.tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesProject = !selectedProject.value || task.project_id.toString() === selectedProject.value
    return matchesSearch && matchesProject
  })
})

onMounted(async () => {
  await projectStore.getProjects()
  await taskStore.getTasks()
  await categoryStore.getCategories()
})

const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
}

const getDueDateClass = (dateString: string): string => {
  if (!dateString) return ''
  const today = new Date()
  const dueDate = new Date(dateString)
  today.setHours(0, 0, 0, 0)
  dueDate.setHours(0, 0, 0, 0)
  const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'font-bold text-red-600'
  if (diffDays <= 3) return 'font-bold text-orange-600'
  if (diffDays <= 7) return 'font-bold text-yellow-600'
  return 'text-green-600'
}

const editTask = (task: Task): void => {
  editingTask.value = task
  formData.value = {
    title: task.title,
    description: task.description,
    due_date: task.due_date,
    project_id: task.project_id,
    category_id: task.category_id || 1,
  }
  showCreateModal.value = true
}

const submitTask = async (): Promise<void> => {
  if (editingTask.value && editingTask.value.id) {
    await taskStore.updateTask(editingTask.value.id, formData.value)
  } else {
    await taskStore.createTask(formData.value)
  }

  if (!taskStore.error) {
    closeModal()
  }
}

const deleteTask = (id: number): void => {
  deletingTaskId.value = id
  showDeleteConfirm.value = true
}

const confirmDelete = async (): Promise<void> => {
  if (deletingTaskId.value) {
    await taskStore.deleteTask(deletingTaskId.value)
    showDeleteConfirm.value = false
    deletingTaskId.value = null
  }
}

const closeModal = (): void => {
  showCreateModal.value = false
  editingTask.value = null
  formData.value = { title: '', description: '', due_date: '', project_id: undefined, category_id: 1 }
  taskStore.clearError()
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
