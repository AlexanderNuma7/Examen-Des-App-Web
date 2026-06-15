<template>
  <div v-if="open" class="contact-panel-backdrop" @click.self="close">
    <aside class="contact-panel">
      <div class="panel-header">
        <h4>Contacto — Moto Sport</h4>
        <button class="close-btn" @click="close">×</button>
      </div>
      <div class="panel-body">
        <p>Esta es la información de contacto de la empresa:</p>
        <ul class="contact-list">
          <li><strong>Teléfono:</strong> <a :href="`tel:${phone}`">{{ phone }}</a></li>
          <li><strong>Correo:</strong> <a :href="`mailto:${email}`">{{ email }}</a></li>
          <li><strong>Dirección:</strong>
            <div>Colombia, Norte de Santander — Ocaña</div>
            <div>Transversal 50 KDX-68-37</div>
          </li>
        </ul>
      </div>
    </aside>
  </div>
</template>

<script>
import { contactOpen } from '@/state/uiState'

export default {
  name: 'ContactPanel',
  data() {
    return {
      phone: '3222492454',
      email: 'MotoSport@gmail.com'
    }
  },
  computed: {
    open() {
      return contactOpen.value
    }
  },
  methods: {
    close() {
      contactOpen.value = false
    }
  }
}
</script>

<style scoped>
.contact-panel-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.6);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  z-index: 2500;
  padding: 48px 24px;
}
.contact-panel {
  width: 360px;
  max-width: calc(100% - 48px);
  background: #0F172A;
  border: 1px solid #334155;
  color: #CBD5E1;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  overflow: hidden;
}
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #1f2937;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
}
.panel-header h4 { margin: 0; color: #F8FAFC; font-family: 'Bebas Neue', sans-serif; }
.close-btn {
  background: transparent;
  border: none;
  color: #CBD5E1;
  font-size: 20px;
  cursor: pointer;
}
.panel-body { padding: 16px; }
.contact-list { list-style: none; padding: 0; margin: 0; }
.contact-list li { margin: 10px 0; }
.contact-list a { color: #EF4444; text-decoration: none; }
</style>
