<template>
  <div>
    <button :class="['st-toggler', { open }]" @click="open = !open" :aria-expanded="open" aria-label="Abrir menú">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>

    <nav class="st-sidebar" :class="{ open }" @click.self="open = false">
      <ul>
        <li><button @click="openContact">Contacto</button></li>
        <li><button @click="showInfo">Información empresa</button></li>
        <li><router-link to="/dashboard/productos" class="nav-link" exact-active-class="active-option">Ver Productos</router-link></li>
        <li v-if="isAdmin"><router-link to="/dashboard/usuarios" class="nav-link" exact-active-class="active-option">Ver Usuarios</router-link></li>
        <li v-if="isAdmin"><router-link to="/dashboard/ordenes" class="nav-link" exact-active-class="active-option">Ver Ventas</router-link></li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'SidebarToggler',
  data() {
    return { open: false }
  },
  computed: {
    isAdmin() {
      return localStorage.getItem('role') === 'admin'
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      this.$router.push('/login')
    },
    showInfo() {
      const { companyOpen } = require('@/state/uiState')
      companyOpen.value = true
      this.open = false
    },
    openContact() {
      const { contactOpen } = require('@/state/uiState')
      contactOpen.value = true
      this.open = false
    },
    goTo(path) {
      this.open = false
      this.$router.push(path)
    }
  }
}
</script>

<style scoped>
.st-toggler {
  position: fixed;
  left: 16px;
  top: 72px;
  z-index: 3000;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: rgba(0,0,0,0.65);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 18px rgba(0,0,0,0.25);
  cursor: pointer;
  transition: transform 0.12s ease, background 0.12s ease;
}
.st-toggler:hover { transform: scale(1.04); background: rgba(0,0,0,0.75); }
.st-toggler:focus { outline: none; box-shadow: 0 0 0 3px rgba(0,123,255,0.18); }
.st-toggler .bar {
  display: block;
  width: 20px;
  height: 2px;
  background: #fff;
  margin: 2px 0;
  transition: transform 0.18s ease, opacity 0.18s ease;
}
.st-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0;
  overflow: hidden;
  background: #0b1220;
  border-right: 1px solid #334155;
  box-shadow: 2px 0 16px rgba(0, 0, 0, 0.32);
  z-index: 1040;
  transition: width 0.4s ease;
  padding-top: 70px;
}
.st-sidebar.open { width: 260px; }
.st-sidebar ul { list-style: none; padding: 0 16px; margin: 0; }
.st-sidebar li { margin: 14px 0; }
.st-sidebar a,
.st-sidebar button,
.st-sidebar .nav-link {
  display: block;
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  padding: 12px 14px;
  color: #f8fafc;
  font-size: 15px;
  cursor: pointer;
  border-radius: 12px;
}
.st-sidebar a,
.st-sidebar .nav-link {
  text-decoration: none;
}
.st-sidebar button:hover,
.st-sidebar a:hover,
.st-sidebar .nav-link:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}
.st-sidebar button:focus,
.st-sidebar a:focus,
.st-sidebar .nav-link:focus {
  outline: 2px solid rgba(148, 163, 184, 0.75);
  outline-offset: 2px;
}
.st-toggler.open .bar:nth-child(2) { opacity: 0; }
.st-toggler.open .bar:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}
</style>
