<template>
  <div class="p-8">
    <div v-if="projectStore.isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="projectStore.currentProject" class="space-y-6">
      <div class="card p-6">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">{{ projectStore.currentProject.name }}</h2>
            <p class="text-gray-600 mt-2">{{ projectStore.currentProject.description }}</p>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <h3 class="text-xl font-bold text-gray-900">Task</h3>
        <button
          @click="showCreateTaskModal = true"
          class="btn btn-primary"
        >
          + Tambah Task
        </button>
      </div>

      <div v-if="taskStore.tasksByProject && taskStore.tasksByProject.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="task in taskStore.tasksByProject"
          :key="task.id"
          class="card p-4"
        >
          <h4 class="font-semibold text-gray-900">{{ task.title }}</h4>
          <p class="text-sm text-gray-600 mt-2">{{ task.description }}</p>
          <div class="mt-4 flex justify-between items-center">
            <span class="text-xs text-gray-600">{{ formatDate(task.due_date) }}</span>
            <button
              @click="editTask(task)"
              class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      <div v-else class="card p-8 text-center text-gray-500">
        Tidak ada task
      </div>

      <transition name="modal">
        <div
          v-if="showCreateTaskModal"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          @click.self="closeTaskModal"
        >
          <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">
              {{ editingTask ? 'Edit Task' : 'Buat Task Baru' }}
            </h3>

            <form @submit.prevent="submitTask" class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Judul Task</label>
                <input
                  v-model="taskFormData.title"
                  type="text"
                  required
                  class="input-field"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
                <textarea
                  v-model="taskFormData.description"
                  class="input-field"
                  rows="3"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                <input
                  v-model="taskFormData.due_date"
                  type="date"
                  required
                  class="input-field"
                />
              </div>

              <div class="flex space-x-3 pt-4">
                <button
                  type="button"
                  @click="closeTaskModal"
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
    </div>

    <div v-else class="card p-8 text-center text-gray-500">
      Projek tidak ditemukan
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'
import { useTaskStore } from '@/stores/taskStore'
import type { Task } from '@/types'

const route = useRoute()
const projectStore = useProjectStore()
const taskStore = useTaskStore()

const showCreateTaskModal: Ref<boolean> = ref(false)
const editingTask: Ref<Task | null> = ref(null)
const taskFormData: Ref<Partial<Task>> = ref({
  title: '',
  description: '',
  due_date: '',
  category_id: 1,
})

onMounted(async () => {
  const projectId = Number(route.params.id)
  await projectStore.getProjectById(projectId)
  await taskStore.getTasksByProject(projectId)
})

const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
}

const editTask = (task: Task): void => {
  editingTask.value = task
  taskFormData.value = {
    title: task.title,
    description: task.description,
    due_date: task.due_date,
    category_id: task.category_id || 1,
  }
  showCreateTaskModal.value = true
}

const submitTask = async (): Promise<void> => {
  const taskData: Partial<Task> = {
    ...taskFormData.value,
    project_id: Number(route.params.id),
  }

  if (editingTask.value && editingTask.value.id) {
    await taskStore.updateTask(editingTask.value.id, taskData)
  } else {
    await taskStore.createTask(taskData)
  }

  if (!taskStore.error) {
    const projectId = Number(route.params.id)
    await projectStore.getProjectById(projectId)
    closeTaskModal()
  }
}

const closeTaskModal = (): void => {
  showCreateTaskModal.value = false
  editingTask.value = null
  taskFormData.value = { title: '', description: '', due_date: '', category_id: 1 }
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
