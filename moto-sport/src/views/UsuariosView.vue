<template>
  <div class="usuarios-section">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h3>Administración de usuarios</h3>
        <p class="text-muted mb-0">Crea, edita y elimina usuarios desde MockAPI.</p>
      </div>
      <button v-if="isAdmin" class="btn btn-success" @click="abrirFormulario">Nuevo usuario</button>
    </div>

    <div v-if="loading" class="alert alert-info">Cargando usuarios...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="success" class="alert alert-success">{{ success }}</div>

    <div class="table-responsive">
      <table class="table table-dark table-hover align-middle usuarios-table">
        <thead class="usuarios-table-head">
          <tr>
            <th>Nombre</th>
            <th>Usuario</th>
            <th>Rol</th>
            <th class="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuarios" :key="usuario.id">
            <td>{{ usuario.name }}</td>
            <td>{{ usuario.userName }}</td>
            <td>
              <span class="badge bg-secondary text-capitalize">{{ getRole(usuario) }}</span>
            </td>
            <td class="text-end">
              <button v-if="isAdmin" class="btn btn-sm btn-primary me-2" @click="editarUsuario(usuario)">
                <i class="bi bi-pencil"></i> Editar
              </button>
              <button v-if="isAdmin" class="btn btn-sm btn-danger" @click="eliminarUsuario(usuario.id)">
                <i class="bi bi-trash"></i> Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="formVisible" class="modal-backdrop" @click.self="cerrarFormulario">
      <div class="modal-card shadow-lg">
        <div class="modal-header d-flex justify-content-between align-items-center">
          <div>
            <h5 class="modal-title mb-0">{{ editando ? 'Editar usuario' : 'Nuevo usuario' }}</h5>
            <small class="text-muted">Los datos se guardarán en MockAPI.</small>
          </div>
          <button type="button" class="btn-close" aria-label="Cerrar" @click="cerrarFormulario"></button>
        </div>
        <div class="modal-body">
          <input v-model="usuarioForm.name" class="form-control mb-2" placeholder="Nombre completo" />
          <input v-model="usuarioForm.userName" class="form-control mb-2" placeholder="Usuario" />
          <input v-model="usuarioForm.password" type="password" class="form-control mb-2" placeholder="Contraseña" />
          <label class="form-label">Rol</label>
          <select v-model="usuarioForm.role" class="form-select mb-2">
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          <div v-if="formError" class="alert alert-danger mt-2">{{ formError }}</div>
          <div v-if="formSuccess" class="alert alert-success mt-2">{{ formSuccess }}</div>
        </div>
        <div class="modal-footer text-end">
          <button class="btn btn-secondary me-2" @click="cerrarFormulario">Cancelar</button>
          <button class="btn btn-primary" @click="guardarUsuario">Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUsers, createUser, updateUser, deleteUser } from '@/services/mockapi'

export default {
  data() {
    return {
      usuarios: [],
      loading: false,
      error: '',
      success: '',
      formVisible: false,
      editando: false,
      editandoId: null,
      usuarioForm: {
        name: '',
        userName: '',
        password: '',
        role: 'user'
      },
      formError: '',
      formSuccess: ''
    }
  },
  computed: {
    isAdmin() {
      return localStorage.getItem('role') === 'admin'
    }
  },
  async created() {
    if (!this.isAdmin) {
      this.$router.replace('/dashboard/productos')
      return
    }
    await this.cargarUsuarios()
  },
  methods: {
    async cargarUsuarios() {
      this.loading = true
      this.error = ''
      this.success = ''
      try {
        this.usuarios = await getUsers()
      } catch (err) {
        this.error = 'Error al cargar usuarios.'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    abrirFormulario() {
      this.resetFormulario()
      this.formVisible = true
    },
    cerrarFormulario() {
      this.formVisible = false
      this.editando = false
      this.editandoId = null
      this.resetFormulario()
    },
    resetFormulario() {
      this.usuarioForm = {
        name: '',
        userName: '',
        password: '',
        role: 'user'
      }
      this.formError = ''
      this.formSuccess = ''
    },
    validarFormulario() {
      if (!this.usuarioForm.name || !this.usuarioForm.userName || !this.usuarioForm.password) {
        this.formError = 'Todos los campos son obligatorios.'
        return false
      }
      return true
    },
    async guardarUsuario() {
      if (!this.isAdmin) {
        this.formError = 'No autorizado.'
        return
      }
      this.formError = ''
      this.formSuccess = ''

      if (!this.validarFormulario()) {
        return
      }

      try {
        if (this.editando) {
          const usuarioActualizado = await updateUser({ id: this.editandoId, ...this.usuarioForm })
          const index = this.usuarios.findIndex(item => item.id === this.editandoId)
          if (index !== -1) {
            this.usuarios.splice(index, 1, usuarioActualizado)
          }
          this.formSuccess = 'Usuario actualizado con éxito.'
        } else {
          const nuevoUsuario = await createUser(this.usuarioForm)
          this.usuarios.unshift(nuevoUsuario)
          this.formSuccess = 'Usuario creado con éxito.'
        }
        this.editando = false
        this.editandoId = null
        this.resetFormulario()
        await this.cargarUsuarios()
      } catch (err) {
        this.formError = 'Error al guardar el usuario.'
        console.error(err)
      }
    },
    getRole(usuario) {
      if (usuario && usuario.role) return usuario.role
      const adminUsers = ['alexander numa', 'emmanuel guerrero']
      const username = (usuario.userName || usuario.name || '').trim().toLowerCase()
      return adminUsers.includes(username) ? 'admin' : 'user'
    },
    editarUsuario(usuario) {
      if (!this.isAdmin) {
        this.formError = 'No autorizado.'
        return
      }
      this.editando = true
      this.editandoId = usuario.id
      this.usuarioForm = {
        name: usuario.name,
        userName: usuario.userName,
        password: usuario.password,
        role: usuario.role || this.getRole(usuario)
      }
      this.formError = ''
      this.formSuccess = ''
      this.formVisible = true
    },
    async eliminarUsuario(id) {
      if (!this.isAdmin) {
        this.error = 'No autorizado.'
        return
      }
      if (!confirm('¿Deseas eliminar este usuario?')) {
        return
      }
      try {
        await deleteUser(id)
        this.usuarios = this.usuarios.filter(usuario => usuario.id !== id)
        this.success = 'Usuario eliminado correctamente.'
      } catch (err) {
        this.error = 'Error al eliminar el usuario.'
        console.error(err)
      }
    }
  }
}
</script>

<style scoped>
.usuarios-section {
  color: #f8fafc;
}
.usuarios-section h3 {
  color: #f8fafc !important;
}
.usuarios-section p {
  color: #f8fafc !important;
}
.table-responsive {
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 1rem;
  padding: 1rem;
}
.usuarios-table {
  color: #f8fafc !important;
  background: #0f172a !important;
}
.usuarios-table-head,
.usuarios-table-head th {
  background-color: #1e293b !important;
  color: #f8fafc !important;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2) !important;
}
.usuarios-table tbody tr {
  border-top: 1px solid rgba(148, 163, 184, 0.12) !important;
}
.usuarios-table tbody td {
  color: #f8fafc !important;
  vertical-align: middle;
}
.usuarios-table.table-hover tbody tr:hover {
  background: rgba(255, 255, 255, 0.08) !important;
}
.usuarios-table .btn-primary,
.usuarios-table .btn-danger,
.usuarios-table .btn-secondary {
  color: #fff !important;
}
.btn-success {
  background: #16a34a;
  border-color: #15803d;
}
.btn-success:hover {
  background: #15803d;
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.modal-card {
  width: min(100%, 560px);
  background: #111827;
  border: 1px solid #334155;
  border-radius: 1rem;
  overflow: hidden;
}
.modal-header,
.modal-footer {
  padding: 1rem 1.25rem;
  background: #0f172a;
}
.modal-body {
  padding: 1rem 1.25rem;
}
.modal-title,
.modal-header small {
  color: #f8fafc;
}
.modal-body .form-control {
  background: #0f172a;
  border: 1px solid #475569;
  color: #f8fafc;
}
.modal-body .form-control::placeholder {
  color: #94a3b8;
}
.btn-close {
  background: transparent;
  border: none;
}
.alert {
  border-radius: 0.75rem;
}
.alert-info,
.alert-success,
.alert-danger {
  background: rgba(30, 41, 59, 0.9);
  border-color: rgba(148, 163, 184, 0.2);
  color: #f8fafc;
}
</style>
