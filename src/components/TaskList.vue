<script setup>
import { ref, onMounted } from 'vue'
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

// Props
const props = defineProps({
  refreshFlag: Boolean,
})

// Emits
const emit = defineEmits(['edit'])

// Data
const tasks = ref([])
const loading = ref(true)

// format status
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

// Ambil data dari firebase
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

      // convert datetime
      if (task.createdAt && task.createdAt.toDate) {
        task.createdAt = task.createdAt.toDate();
      }

      tasksData.push(task);
    });

    tasks.value = tasksData;
    loading.value = false;
  }, (error) => {
    console.error('Gagal ambil data');
    loading.value = false;
  });

  return unsubscribe;

};

// Delete Task List
const deleteTask = async (taskId) => {
  if (confirm('Apakah Yakin Mau Di Hapus?')) {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error('Gagal Delete');
    }
  }
};

// Edit Task
const editTask = (task) => {
  emit('edit', task);
};

// lifesycle hook
let unsubscribe;

onMounted(() => {
  unsubscribe = fetchTasks();
});

</script>

<template>
  <div class="task-list">
    <h2>Task List:</h2>

    <div class="loading" v-if="loading">loading...</div>

    <div class="no-task" v-else-if="tasks.length === 0">Belum Ada Task Yang Dibuat</div>

    <div class="tasks" v-else>
      <div class="task-card" v-for="task in tasks" :key="task.id" :class="task.status">
        <div class="task-content">
          <h3>{{ task.title }}</h3>
          <p>{{ task.description }}</p>
          <div class="task-status">
            Status: <span>{{ formatStatus(task.status) }}</span>
          </div>
        </div>

        <div class="task-actions">
          <button @click="editTask(task)" class="btn-edit">Edit</button>
          <button @click="deleteTask(task.id)" class="btn-delete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>
