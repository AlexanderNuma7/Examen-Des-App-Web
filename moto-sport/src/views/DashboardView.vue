<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <span class="navbar-brand">Moto Sport</span>
        <button class="navbar-toggler" type="button" @click="menuOpen = !menuOpen">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div :class="['collapse navbar-collapse', { show: menuOpen }]">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a @click.prevent="logout" class="nav-link text-danger" style="cursor:pointer;">🚪 Cerrar sesión</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container mt-4">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuOpen: false
    }
  },
  computed: {
    isAdmin() {
      return localStorage.getItem('role') === 'admin'
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('logueado')
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('userName')
      this.$router.push('/login')
    }
    ,
    openContact() {
      const { contactOpen } = require('@/state/uiState')
      contactOpen.value = true
    }
  }
}
</script>