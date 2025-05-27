<script setup>
import { ref } from 'vue';
import { isAuthenticated } from './stores/auth';
import LoginForm from './components/Login.vue';
import AppHeader from './components/AppHeader.vue';
import TaskForm from './components/TaskForm.vue';
import TaskList from './components/TaskList.vue';

// State
const taskToEdit = ref(null);
const refreshFlag = ref(false);

// Authentication event handlers
const handleLoginSuccess = () => {
  // Authentication state is handled by the auth store
  // Component will automatically re-render when isAuthenticated changes
  console.log('Login successful!');
};

const handleLogout = () => {
  // Clear any editing state when logging out
  taskToEdit.value = null;
  console.log('Logged out successfully!');
};

// Task management event handlers
const handleTaskAdded = () => {
  refreshFlag.value = !refreshFlag.value;
};

const handleTaskUpdated = () => {
  taskToEdit.value = null;
  refreshFlag.value = !refreshFlag.value;
};

const handleEditTask = (task) => {
  taskToEdit.value = task;
};

const handleCancelEdit = () => {
  taskToEdit.value = null;
};
</script>

<template>
  <div class="app">
    <!-- Show Login Form if not authenticated -->
    <LoginForm 
      v-if="!isAuthenticated" 
      @loginSuccess="handleLoginSuccess"
    />
    
    <!-- Show Main App if authenticated -->
    <div v-else>
      <AppHeader @logout="handleLogout" />
      
      <main>
        <TaskForm 
          :editTask="taskToEdit" 
          @taskAdded="handleTaskAdded" 
          @taskUpdated="handleTaskUpdated" 
          @cancelEdit="handleCancelEdit"
        />
        
        <TaskList 
          :refreshFlag="refreshFlag" 
          @edit="handleEditTask"
        />
      </main>
      
      <footer>
        <p>Simple Vue 3 + Firebase CRUD App with Authentication | {{ new Date().getFullYear() }}</p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
