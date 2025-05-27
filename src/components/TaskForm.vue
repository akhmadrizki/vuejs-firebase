<script setup>
import { ref, watch } from 'vue';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { isAuthenticated } from '../stores/auth';

// Props
const props = defineProps({
  editTask: Object
});

// Emits
const emit = defineEmits(['taskAdded', 'taskUpdated', 'cancelEdit']);

// Form data
const title = ref('');
const description = ref('');
const status = ref('pending');
const editing = ref(false);

// Watch for changes to editTask prop
watch(() => props.editTask, (newTask) => {
  if (newTask) {
    title.value = newTask.title;
    description.value = newTask.description;
    status.value = newTask.status;
    editing.value = true;
  }
}, { immediate: true });

// Submit form handler
const handleSubmit = async () => {
  try {
    const task = {
      title: title.value,
      description: description.value,
      status: status.value,
      createdAt: new Date()
    };

    if (editing.value) {
      // Update existing task
      const taskRef = doc(db, 'tasks', props.editTask.id);
      await updateDoc(taskRef, task);
      emit('taskUpdated');
    } else {
      // Add new task
      const tasksCollection = collection(db, 'tasks');
      await addDoc(tasksCollection, task);
      emit('taskAdded');
    }

    // Reset form
    resetForm();
  } catch (error) {
    console.error('Error adding/updating task: ', error);
  }
};

// Reset the form
const resetForm = () => {
  title.value = '';
  description.value = '';
  status.value = 'pending';
  editing.value = false;
};

// Cancel edit mode
const cancelEdit = () => {
  resetForm();
  emit('cancelEdit');
};
</script>

<template>
  <div class="task-form">
    <h2>{{ editing ? 'Edit Task' : 'Add New Task' }}</h2>
    
    <!-- Show message if not authenticated -->
    <div v-if="!isAuthenticated" class="auth-required">
      <p>Please login to add or edit tasks.</p>
    </div>
    
    <!-- Show form only if authenticated -->
    <form v-else @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Title:</label>
        <input 
          type="text" 
          id="title" 
          v-model="title" 
          required
          placeholder="Enter task title"
        />
      </div>
      
      <div class="form-group">
        <label for="description">Description:</label>
        <textarea 
          id="description" 
          v-model="description" 
          placeholder="Enter task description"
        ></textarea>
      </div>
      
      <div class="form-group">
        <label for="status">Status:</label>
        <select id="status" v-model="status">
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      
      <div class="form-buttons">
        <button type="submit" class="btn-submit">
          {{ editing ? 'Update Task' : 'Add Task' }}
        </button>
        
        <button 
          type="button" 
          class="btn-cancel" 
          v-if="editing"
          @click="cancelEdit"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.task-form {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

h2 {
  margin-top: 0;
  color: #333;
}

.auth-required {
  text-align: center;
  padding: 20px;
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  color: #856404;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="text"],
textarea,
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

textarea {
  height: 100px;
}

.form-buttons {
  display: flex;
  gap: 10px;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.btn-submit {
  background-color: #4CAF50;
  color: white;
}

.btn-cancel {
  background-color: #f44336;
  color: white;
}
</style>