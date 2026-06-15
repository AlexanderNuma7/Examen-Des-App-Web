<template>
  <div class="ordenes-section">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h3>Ventas / Órdenes</h3>
        <p class="mb-0">Listado de compras realizadas.</p>
      </div>
      <button class="btn btn-secondary" @click="cargarOrdenes">Recargar</button>
    </div>

    <div v-if="orders.length === 0" class="alert alert-info">No hay compras registradas.</div>

    <div v-else class="table-responsive">
      <table class="table table-dark table-hover align-middle usuarios-table">
        <thead class="usuarios-table-head">
          <tr>
            <th>Comprador</th>
            <th>Producto</th>
            <th>Precio</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Método pago</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th class="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.buyer }}</td>
            <td>{{ order.product.nombre || order.product.name || order.product.title }}</td>
            <td>${{ order.product.precio || order.product.price || '' }}</td>
            <td>{{ order.email }}</td>
            <td>{{ order.phone }}</td>
            <td>{{ order.paymentMethod }}</td>
            <td>{{ order.status }}</td>
            <td>{{ order.date }}</td>
            <td class="text-end">
              <button class="btn btn-sm btn-primary me-2" @click="contactar(order)">Contactar</button>
              <button class="btn btn-sm btn-danger" @click="eliminarOrden(order.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orders: []
    }
  },
  computed: {
    isAdmin() {
      return localStorage.getItem('role') === 'admin'
    }
  },
  created() {
    if (!this.isAdmin) {
      this.$router.replace('/dashboard/productos')
      return
    }
    this.cargarOrdenes()
  },
  methods: {
    cargarOrdenes() {
      try {
        this.orders = JSON.parse(localStorage.getItem('orders') || '[]')
      } catch (err) {
        this.orders = []
      }
    }
    ,
    eliminarOrden(id) {
      if (!confirm('¿Deseas eliminar esta orden?')) return
      try {
        const list = JSON.parse(localStorage.getItem('orders') || '[]')
        const filtered = list.filter(o => o.id !== id)
        localStorage.setItem('orders', JSON.stringify(filtered))
        this.orders = filtered
      } catch (err) {
        console.error(err)
      }
    },
    contactar(order) {
      if (!order || !order.email) {
        alert('No hay correo de contacto disponible para esta orden.')
        return
      }
      const subject = encodeURIComponent(`Consulta sobre compra: ${order.product.nombre || order.product.name || ''}`)
      const body = encodeURIComponent(`Hola ${order.buyer || ''},%0D%0A%0D%0AQuisiera consultarte sobre la compra del producto ${order.product.nombre || order.product.name || ''}.`)
      window.location.href = `mailto:${order.email}?subject=${subject}&body=${body}`
    }
  }
}
</script>

<style scoped>
.ordenes-section h3 { color: #f8fafc; }
.ordenes-section p { color: #cbd5e1; }
.usuarios-table { color: #f8fafc !important; background: #0f172a !important; }
.usuarios-table-head, .usuarios-table-head th { background-color: #1e293b !important; color: #f8fafc !important; }
.usuarios-table tbody td { color: #f8fafc !important; }
</style>
