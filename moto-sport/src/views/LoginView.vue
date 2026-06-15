<template>
  <div class="login-page d-flex align-items-center justify-content-center min-vh-100 py-5">
    <div class="card login-card shadow-lg rounded-4 overflow-hidden">
      <div class="login-card-header text-center text-white py-4">
        <div class="login-logo mb-3">🏍️</div>
        <h2 class="mb-1">Moto Sport</h2>
        <p class="mb-0 opacity-85">Ingresa con tus credenciales para continuar</p>
      </div>

      <div class="card-body p-4">
        <div class="mb-3">
          <label class="form-label">Usuario</label>
          <input
            v-model="usuario"
            class="form-control form-control-lg"
            placeholder="Ingresa tu usuario"
          />
        </div>

        <div class="mb-4">
          <label class="form-label">Contraseña</label>
          <input
            v-model="clave"
            type="password"
            class="form-control form-control-lg"
            placeholder="Ingresa tu contraseña"
          />
        </div>

        <button class="btn btn-primary btn-lg w-100 mb-2" @click="login">
          Entrar
        </button>

        <div v-if="error" class="alert alert-danger mt-3" role="alert">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserByUsername } from '@/services/mockapi'

export default {
  data() {
    return {
      usuario: '',
      clave: '',
      error: ''
    }
  },
  async created() {
    if (localStorage.getItem('token')) {
      this.$router.push('/dashboard/productos')
    }
  },
  methods: {
    async login() {
      this.error = ''
      if (!this.usuario || !this.clave) {
        this.error = 'Debe ingresar usuario y contraseña'
        return
      }

      try {
        const user = await getUserByUsername(this.usuario)

        if (!user || user.password !== this.clave) {
          this.error = 'Credenciales incorrectas'
          return
        }

        const username = (user.userName || user.name || '').trim()
        const adminUsers = ['alexander numa', 'emmanuel guerrero']
        const role = adminUsers.includes(username.toLowerCase()) ? 'admin' : 'user'

        localStorage.setItem('token', `token-${Date.now()}`)
        localStorage.setItem('logueado', 'true')
        localStorage.setItem('role', role)
        localStorage.setItem('userName', username)
        this.$router.push('/dashboard/productos')
      } catch (error) {
        this.error = 'Error al conectarse al servidor'
        console.error(error)
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  background: radial-gradient(circle at top, rgba(255, 255, 255, 0.08), transparent 35%),
    linear-gradient(180deg, #111827 0%, #0F172A 100%);
}

.login-card {
  width: min(100%, 420px);
  border: 1px solid #334155;
  background: #111827;
}

.login-card-header {
  background: linear-gradient(135deg, #111827, #1E293B);
  border-bottom: 1px solid #334155;
}

.login-logo {
  width: 72px;
  height: 72px;
  margin: 0 auto;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.14);
  display: grid;
  place-items: center;
  font-size: 2rem;
  color: #EF4444;
}

.login-card .form-label {
  font-weight: 600;
  color: #F8FAFC;
}

.login-card .form-control {
  background: #1E293B;
  border: 1px solid #475569;
  color: #fff;
}

.login-card .form-control::placeholder {
  color: #94A3B8;
}

.login-card .btn-primary {
  background: #2563EB;
  border-color: #2563EB;
}

.login-card .btn-primary:hover {
  background: #1D4ED8;
}

.login-card .alert-danger {
  background: rgba(220, 38, 38, 0.14);
  border-color: #B91C1C;
  color: #F8FAFC;
}
</style>
