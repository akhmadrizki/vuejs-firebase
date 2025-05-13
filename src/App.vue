<script setup>
import { ref } from 'vue'
import TaskForm from './components/TaskForm.vue'
import TaskList from './components/TaskList.vue'

// state
const taskToEdit = ref(null)
const refreshFlag = ref(false)

// event handler
const handleTaskAdded = () => {
  refreshFlag.value = !refreshFlag.value
}

const handleTaskUpdated = () => {
  taskToEdit.value = null
  refreshFlag.value = !refreshFlag.value
}

const handleEditTask = (task) => {
  taskToEdit.value = task
}

const handleCancelEdit = () => {
  taskToEdit.value = null
}
</script>

<template>
  <TaskForm
    :editTask="taskToEdit"
    @taskAdded="handleTaskAdded"
    @taskUpdated="handleTaskUpdated"
    @cancel="handleCancelEdit"
  />

  <TaskList
    :refreshFlag="refreshFlag"
    @edit="handleEditTask"
  />
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
