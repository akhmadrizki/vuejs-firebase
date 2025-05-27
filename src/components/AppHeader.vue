<template>
  <header class="app-header">
    <h1>Task Manager</h1>
    
    <div v-if="isAuthenticated" class="user-info">
      <span>Welcome, {{ currentUser.username }}!</span>
      <button @click="handleLogout" class="btn-logout">
        Logout
      </button>
    </div>
  </header>
</template>

<script setup>
import { isAuthenticated, currentUser, logout } from '../stores/auth';

// Emits
const emit = defineEmits(['logout']);

// Handle logout
const handleLogout = () => {
  logout();
  emit('logout');
};
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 2px solid #4CAF50;
  margin-bottom: 30px;
}

h1 {
  color: #333;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info span {
  color: #666;
  font-weight: bold;
}

.btn-logout {
  padding: 8px 16px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-logout:hover {
  background-color: #d32f2f;
}
</style>