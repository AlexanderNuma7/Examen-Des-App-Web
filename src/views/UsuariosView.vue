<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h3>Administración de usuarios</h3>
        <p class="text-muted mb-0">Crea, edita y elimina usuarios desde MockAPI.</p>
      </div>
      <button class="btn btn-success" @click="abrirFormulario">Nuevo usuario</button>
    </div>

    <div v-if="loading" class="alert alert-info">Cargando usuarios...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="success" class="alert alert-success">{{ success }}</div>

    <div class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>Nombre</th>
            <th>Usuario</th>
            <th class="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuarios" :key="usuario.id">
            <td>{{ usuario.name }}</td>
            <td>{{ usuario.userName }}</td>
            <td class="text-end">
              <button class="btn btn-sm btn-primary me-2" @click="editarUsuario(usuario)">
                <i class="bi bi-pencil"></i> Editar
              </button>
              <button class="btn btn-sm btn-danger" @click="eliminarUsuario(usuario.id)">
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
        password: ''
      },
      formError: '',
      formSuccess: ''
    }
  },
  async created() {
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
        password: ''
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
    editarUsuario(usuario) {
      this.editando = true
      this.editandoId = usuario.id
      this.usuarioForm = {
        name: usuario.name,
        userName: usuario.userName,
        password: usuario.password
      }
      this.formError = ''
      this.formSuccess = ''
      this.formVisible = true
    },
    async eliminarUsuario(id) {
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
