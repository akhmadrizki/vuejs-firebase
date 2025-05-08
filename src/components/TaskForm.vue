<script setup>
import { ref, watch } from 'vue'
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

// props
const props = defineProps({
  editTask: Object,
})

// Emits
const emit = defineEmits(['taskAdded', 'taskUpdated', 'cancelEdit'])

// Form Data
const title = ref('')
const description = ref('')
const status = ref('pending')
const editing = ref(false)

// Watch perubahan dari edit task
watch(
  () => props.editTask,
  (newTask) => {
    if (newTask) {
      title.value = newTask.title
      description.value = newTask.description
      status.value = newTask.status
      editing.value = true
    }
  },
  { immediate: true },
)

// Submit Handler
const handleSubmit = async () => {
  try {
    const task = {
      title: title.value,
      description: description.value,
      status: status.value,
      createdAt: new Date(),
    }

    if (editing.value) {
      const taskRef = doc(db, 'tasks', props.editTask.id)
      await updateDoc(taskRef, task)
      emit('taskUpdated')
    } else {
      const tasksCollection = collection(db, 'tasks')
      await addDoc(tasksCollection, task)
      emit('taskAdded')
    }

    resetForm()
  } catch (error) {
    console.error('gagal input / edit', error)
  }
}

const resetForm = () => {
  title.value = ''
  description.value = ''
  status.value = 'pending'
  editing.value = false
}

const cancelEdit = () => {
  resetForm()
  emit('cancelEdit')
}
</script>

<template>
  <div class="task-form">
    <h2>{{ editing ? 'Edit Task' : 'Add New Task' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Title:</label>
        <input type="text" id="title" v-model="title" required />
      </div>

      <div class="form-group">
        <label for="description">Description:</label>
        <textarea id="description" v-model="description"></textarea>
      </div>

      <div class="form-group">
        <label for="status">Status:</label>
        <select id="status" v-model="status">
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="complete">Complete</option>
        </select>
      </div>

      <div class="form-buttons">
        <button type="submit" class="btn-submit">
          {{ editing ? 'Update Task' : 'Add Task' }}
        </button>

        <button type="button" class="btn-cancel" v-if="editing" @click="cancelEdit">Cancel</button>
      </div>
    </form>
  </div>
</template>
