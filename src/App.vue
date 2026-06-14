<template>
  <div id="app">
    <SidebarToggler />
    <!-- Aquí se renderiza la vista activa -->
    <router-view />
  </div>
</template>
<script>
import SidebarToggler from '@/components/SidebarToggler.vue'

export default {
  name: 'App',
  components: { SidebarToggler }
}
</script>
