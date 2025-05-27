<script setup>
import { ref, onMounted } from 'vue';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { isAuthenticated } from '../stores/auth';

// Props
const props = defineProps({
  refreshFlag: Boolean
});

// Emits
const emit = defineEmits(['edit']);

// Data
const tasks = ref([]);
const loading = ref(true);

// Format task status for display
const formatStatus = (status) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'in-progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    default:
      return status;
  }
};

// Fetch tasks from Firestore
const fetchTasks = () => {
  const tasksCollection = collection(db, 'tasks');
  const tasksQuery = query(tasksCollection, orderBy('createdAt', 'desc'));
  
  const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
    const tasksData = [];
    snapshot.forEach((doc) => {
      const task = {
        id: doc.id,
        ...doc.data()
      };
      
      // Convert Firestore timestamp to Date object
      if (task.createdAt && task.createdAt.toDate) {
        task.createdAt = task.createdAt.toDate();
      }
      
      tasksData.push(task);
    });
    
    tasks.value = tasksData;
    loading.value = false;
  }, (error) => {
    console.error('Error fetching tasks: ', error);
    loading.value = false;
  });
  
  return unsubscribe;
};

// Delete a task (only if authenticated)
const deleteTask = async (taskId) => {
  if (!isAuthenticated.value) {
    alert('Please login to delete tasks');
    return;
  }
  
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error('Error deleting task: ', error);
    }
  }
};

// Edit a task (only if authenticated)
const editTask = (task) => {
  if (!isAuthenticated.value) {
    alert('Please login to edit tasks');
    return;
  }
  
  emit('edit', task);
};

// Lifecycle hooks
let unsubscribe;

onMounted(() => {
  unsubscribe = fetchTasks();
});
</script>

<template>
  <div class="task-list">
    <h2>Tasks</h2>
    
    <div v-if="loading" class="loading">
      Loading tasks...
    </div>
    
    <div v-else-if="tasks.length === 0" class="no-tasks">
      No tasks found. Add a new task to get started!
    </div>
    
    <div v-else class="tasks">
      <div 
        v-for="task in tasks" 
        :key="task.id" 
        class="task-card"
        :class="task.status"
      >
        <div class="task-content">
          <h3>{{ task.title }}</h3>
          <p>{{ task.description }}</p>
          <div class="task-status">
            Status: <span>{{ formatStatus(task.status) }}</span>
          </div>
        </div>
        
        <!-- Only show edit/delete buttons if authenticated -->
        <div v-if="isAuthenticated" class="task-actions">
          <button @click="editTask(task)" class="btn-edit">
            Edit
          </button>
          <button @click="deleteTask(task.id)" class="btn-delete">
            Delete
          </button>
        </div>
        
        <!-- Show login message if not authenticated -->
        <div v-else class="auth-message">
          <small>Login to edit or delete tasks</small>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-list {
  margin-top: 20px;
}

.loading,
.no-task {
  text-align: center;
  padding: 20px;
  color: #fff;
}

.task-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-left: 5px solid #4caf50;
  margin-bottom: 20px;
}

.task-card.pending {
  border-left-color: #ff9800;
}

.task-card.in-progress {
  border-left-color: #2196f3;
}

.task-content {
  margin-top: 0;
  color: black;
}

/* .task-status {
  margin-top: 10px;
  font-size: 14px;
  color: red;
} */

.task-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.btn-edit,
.btn-delete {
  padding: 5px 15px;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.btn-edit {
  background-color: #2196f3;
  color: white;
}

.btn-delete {
  background-color: red;
  color: white;
}
</style>
