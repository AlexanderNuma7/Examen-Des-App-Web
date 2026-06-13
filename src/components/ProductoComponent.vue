<template>
  <div class="container mt-4">
    <div v-if="loading" class="alert alert-info">Cargando productos...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="row gy-4">
      <div v-for="producto in productos" :key="producto.id" class="col-md-6 col-xl-4">
        <div class="card shadow-sm h-100">
          <img :src="producto.imagen || defaultImage" @error="imagenFallback($event)" class="card-img-top product-image" :alt="producto.nombre" />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ producto.nombre }}</h5>
            <p class="mb-1"><strong>Marca:</strong> {{ producto.marca || 'No especificada' }}</p>
            <p class="mb-1"><strong>Cilindraje:</strong> {{ producto.cilindraje || 'N/A' }}</p>
            <p class="card-text text-secondary mb-2">{{ producto.descripcion || 'Sin descripción disponible.' }}</p>
            <div class="mt-auto">
              <p class="fw-bold fs-5 text-danger">${{ producto.precio }}</p>
              <div class="d-flex flex-wrap gap-2">
                <button v-if="isAdmin" class="btn btn-primary btn-sm" @click="editar(producto)">✏️ Editar</button>
                <button v-if="isAdmin" class="btn btn-danger btn-sm" @click="eliminar(producto.id)">🗑️ Eliminar</button>
                <button class="btn btn-success btn-sm ms-auto" @click="comprar(producto)">🛒 Comprar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="checkoutModalVisible" class="modal-backdrop" @click.self="cerrarCheckout">
      <div class="modal-card shadow-lg">
        <div class="modal-header d-flex justify-content-between align-items-center">
          <div>
            <h5 class="modal-title mb-0">Datos de compra</h5>
            <small class="text-muted">Ingresa tu correo, teléfono y método de pago</small>
          </div>
          <button type="button" class="btn-close" aria-label="Cerrar" @click="cerrarCheckout"></button>
        </div>
        <div class="modal-body">
          <div v-if="checkoutProduct" class="mb-3">
            <p class="mb-1"><strong>Producto:</strong> {{ checkoutProduct.nombre }}</p>
            <p class="mb-0"><strong>Precio:</strong> ${{ checkoutProduct.precio }}</p>
          </div>
          <input v-model="checkoutData.email" type="email" class="form-control mb-2" placeholder="Correo electrónico" />
          <input v-model="checkoutData.phone" type="tel" class="form-control mb-2" placeholder="Teléfono" />
          <select v-model="checkoutData.paymentMethod" class="form-select mb-2">
            <option value="Tarjeta de crédito">Tarjeta de crédito</option>
            <option value="Transferencia bancaria">Transferencia bancaria</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Otro">Otro</option>
          </select>
          <div v-if="checkoutError" class="alert alert-danger p-2">{{ checkoutError }}</div>
        </div>
        <div class="modal-footer text-end">
          <button class="btn btn-secondary me-2" @click="cerrarCheckout">Cancelar</button>
          <button class="btn btn-success" @click="confirmarCompra">Confirmar compra</button>
        </div>
      </div>
    </div>

    <div v-if="modalVisible" class="modal-backdrop" @click.self="cerrarModal">
      <div class="modal-card shadow-lg">
        <div class="modal-header d-flex justify-content-between align-items-center">
          <div>
            <h5 class="modal-title mb-0">Atención</h5>
            <small class="text-muted">Revisa los datos del formulario</small>
          </div>
          <button type="button" class="btn-close" aria-label="Cerrar" @click="cerrarModal"></button>
        </div>
        <div class="modal-body">
          <p class="mb-0">{{ modalMessage }}</p>
        </div>
        <div class="modal-footer text-end">
          <button class="btn btn-secondary" @click="cerrarModal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/services/mockapi'

export default {
  data() {
    return {
      productos: [],
      nuevo: {
        nombre: '',
        precio: '',
        marca: '',
        cilindraje: '',
        imagen: '',
        descripcion: ''
      },
      editando: false,
      editandoId: null,
      loading: false,
      error: '',
      formError: '',
      formSuccess: '',
      modalVisible: false,
      modalMessage: '',
      checkoutModalVisible: false,
      checkoutProduct: null,
      checkoutData: {
        email: '',
        phone: '',
        paymentMethod: 'Tarjeta de crédito'
      },
      checkoutError: ''
    }
  },
  computed: {
    role() {
      return localStorage.getItem('role') || 'user'
    },
    isAdmin() {
      return this.role === 'admin'
    },
    defaultImage() {
      return 'https://via.placeholder.com/600x400?text=Imagen+no+disponible'
    }
  },
  async created() {
    await this.cargarProductos()
  },
  methods: {
    async cargarProductos() {
      this.loading = true
      this.error = ''
      try {
        this.productos = await getProducts()
      } catch (error) {
        this.error = 'Error al cargar productos'
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    validarFormulario() {
      this.formError = ''
      this.formSuccess = ''

      if (!this.nuevo.nombre || !this.nuevo.marca || !this.nuevo.precio || !this.nuevo.cilindraje || !this.nuevo.imagen) {
        this.formError = 'Todos los campos son obligatorios, excepto la descripción.'
        return false
      }
      return true
    },
    async agregar() {
      if (!this.validarFormulario()) {
        return
      }

      try {
        if (this.editando) {
          const productoActualizado = await updateProduct({ id: this.editandoId, ...this.nuevo })
          const index = this.productos.findIndex(producto => producto.id === this.editandoId)
          if (index !== -1) {
            this.productos.splice(index, 1, productoActualizado)
          }
          this.formSuccess = 'Producto actualizado con éxito.'
        } else {
          const productoCreado = await createProduct(this.nuevo)
          this.productos.unshift(productoCreado)
          this.formSuccess = 'Producto agregado con éxito.'
        }

        this.resetForm()
      } catch (error) {
        this.formError = 'Error al guardar el producto.'
        console.error(error)
      }
    },
    async editar(producto) {
      this.editando = true
      this.editandoId = producto.id
      this.nuevo = {
        nombre: producto.nombre,
        precio: producto.precio,
        marca: producto.marca,
        cilindraje: producto.cilindraje,
        imagen: producto.imagen,
        descripcion: producto.descripcion || ''
      }
      this.formError = ''
      this.formSuccess = ''
    },
    cancelar() {
      this.resetForm()
    },
    async restablecer() {
      await this.cargarProductos()
      this.modalMessage = 'Catálogo restaurado desde el servidor.'
      this.modalVisible = true
    },
    limpiarCache() {
      this.error = ''
      this.formError = ''
      this.formSuccess = ''
      this.cargarProductos()
      this.modalMessage = 'Datos recargados correctamente.'
      this.modalVisible = true
    },
    async eliminar(id) {
      if (!confirm('¿Estás seguro de que deseas eliminar esta moto?')) {
        return
      }
      try {
        await deleteProduct(id)
        this.productos = this.productos.filter(producto => producto.id !== id)
      } catch (error) {
        this.error = 'Error al eliminar el producto'
        console.error(error)
      }
    },
    comprar(producto) {
      this.checkoutProduct = { ...producto }
      this.checkoutData = {
        email: '',
        phone: '',
        paymentMethod: 'Tarjeta de crédito'
      }
      this.checkoutError = ''
      this.checkoutModalVisible = true
    },
    confirmarCompra() {
      if (!this.checkoutData.email || !this.checkoutData.phone || !this.checkoutData.paymentMethod) {
        this.checkoutError = 'Por favor completa todos los campos antes de confirmar.'
        return
      }

      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      const comprador = localStorage.getItem('userName') || 'Cliente'
      orders.push({
        id: Date.now().toString(),
        buyer: comprador,
        product: { ...this.checkoutProduct },
        email: this.checkoutData.email,
        phone: this.checkoutData.phone,
        paymentMethod: this.checkoutData.paymentMethod,
        status: 'En proceso de pago',
        date: new Date().toLocaleString()
      })
      localStorage.setItem('orders', JSON.stringify(orders))
      this.checkoutModalVisible = false
      this.modalMessage = `Compra de ${this.checkoutProduct.nombre} registrada en proceso de pago.`
      this.modalVisible = true
    },
    cerrarCheckout() {
      this.checkoutModalVisible = false
      this.checkoutProduct = null
      this.checkoutData = {
        email: '',
        phone: '',
        paymentMethod: 'Tarjeta de crédito'
      }
      this.checkoutError = ''
    },
    cerrarModal() {
      this.modalVisible = false
      this.modalMessage = ''
    },
    imagenFallback(event) {
      event.target.onerror = null
      event.target.src = this.defaultImage
    },
    resetForm() {
      this.nuevo = {
        nombre: '',
        precio: '',
        marca: '',
        cilindraje: '',
        imagen: '',
        descripcion: ''
      }
      this.editando = false
      this.editandoId = null
    }
  }
}
</script>

<style scoped>
.product-image {
  width: 100%;
  height: 260px;
  object-fit: cover;
  object-position: center;
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;
}

.card {
  border-radius: 18px;
}

.card-body {
  padding: 1.25rem;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-card {
  width: min(95vw, 520px);
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  animation: fadeInUp 0.25s ease;
}

.modal-header,
.modal-footer {
  padding: 1rem 1.25rem;
}

.modal-body {
  padding: 0 1.25rem 1.25rem;
}

.modal-header {
  border-bottom: 1px solid #e9ecef;
}

.modal-footer {
  border-top: 1px solid #e9ecef;
}

.btn-close {
  background: transparent;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
}

.btn-close::before {
  content: "×";
  color: #495057;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
