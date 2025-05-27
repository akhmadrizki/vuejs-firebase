<template>
  <div class="login-container">
    <div class="login-form">
      <h2>Login to Task Manager</h2>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Username:</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            required
            placeholder="Enter username"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required
            placeholder="Enter password"
          />
        </div>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <button type="submit" class="btn-login" :disabled="isLoading">
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
      
      <div class="demo-credentials">
        <h4>Demo Credentials:</h4>
        <p>Username: <strong>admin</strong></p>
        <p>Password: <strong>password123</strong></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { login } from '../stores/auth';

// Emits
const emit = defineEmits(['loginSuccess']);

// Form data
const username = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

// Handle login
const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const result = login(username.value, password.value);
  
  if (result.success) {
    emit('loginSuccess');
  } else {
    errorMessage.value = result.message;
  }
  
  isLoading.value = false;
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.login-form {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #4CAF50;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
}

.btn-login {
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.btn-login:hover:not(:disabled) {
  background-color: #45a049;
}

.btn-login:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.demo-credentials {
  margin-top: 30px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 4px;
  text-align: center;
}

.demo-credentials h4 {
  margin-top: 0;
  color: #666;
}

.demo-credentials p {
  margin: 5px 0;
  color: #333;
}
</style>