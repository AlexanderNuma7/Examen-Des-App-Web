<template>
  <div>
    <button :class="['st-toggler', { open }]" @click="open = !open" :aria-expanded="open" aria-label="Abrir menú">
      <span class="bar" />
      <span class="bar" />
      <span class="bar" />
    </button>

    <nav class="st-sidebar" :class="{ open }" @click.self="open = false">
      <ul>
        <li><button @click="logout">Cerrar sesión</button></li>
        <li><a href="mailto:contacto@empresa.com">Contacto</a></li>
        <li><button @click="showInfo">Información empresa</button></li>
        <li><button @click="goTo('/dashboard')">Ver</button></li>
        <li><button @click="goTo('/dashboard/productos')">Ver Productos</button></li>
        <li><button @click="goTo('/dashboard/usuarios')">Ver Usuarios</button></li>
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
  methods: {
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      this.$router.push('/login')
    },
    showInfo() {
      // Mensaje sencillo para no alterar la app
      alert('Empresa XYZ - Información básica.');
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
  left: 8px;
  top: 8px;
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
  background: rgba(255,255,255,0.98);
  box-shadow: 2px 0 8px rgba(0,0,0,0.12);
  z-index: 1040;
  transition: width 0.22s ease;
  padding-top: 70px;
}
.st-sidebar.open { width: 260px; }
.st-sidebar ul { list-style: none; padding: 0 12px; margin: 0; }
.st-sidebar li { margin: 12px 0; }
.st-sidebar a, .st-sidebar button {
  display: block;
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  padding: 10px 14px;
  color: #222;
  font-size: 15px;
  cursor: pointer;
}
.st-sidebar a { text-decoration: none; }
.st-sidebar button:hover, .st-sidebar a:hover { background: #f2f2f2; }

/* animación simple de icono al abrir */
.st-toggler.open .bar:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}
.st-toggler.open .bar:nth-child(2) { opacity: 0; }
.st-toggler.open .bar:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

</style>
