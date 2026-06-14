<template>
  <div v-if="open" class="company-panel-backdrop" @click.self="close">
    <aside class="company-panel">
      <div class="panel-header">
        <h3>Información — Moto Sport</h3>
        <button class="close-btn" @click="close">×</button>
      </div>
      <div class="panel-body">
        <p class="slogan">Moto Sport — Potencia, Pasión y Confianza</p>

        <section class="section">
          <h4>Misión</h4>
          <p>
            Proveer motocicletas, accesorios y servicios de alta calidad que impulsen la libertad y el rendimiento
            de nuestros clientes, entregando una atención personalizada, compromiso con la seguridad y una experiencia
            de compra confiable.
          </p>
        </section>

        <section class="section">
          <h4>Visión</h4>
          <p>
            Ser la referencia líder en América Latina en soluciones para motociclistas, reconocidos por innovación,
            confianza y una experiencia excepcional que haga que cada cliente nos elija una y otra vez.
          </p>
        </section>

        <section class="section">
          <h4>Dirección</h4>
          <p>Colombia, Norte de Santander — Ocaña<br/>Transversal 50 KDX-68-37</p>
        </section>
      </div>
    </aside>
  </div>
</template>

<script>
import { companyOpen } from '@/state/uiState'

export default {
  name: 'CompanyInfoPanel',
  computed: {
    open() { return companyOpen.value }
  },
  methods: {
    close() { companyOpen.value = false }
  }
}
</script>

<style scoped>
.company-panel-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2500;
  padding: 24px;
}
.company-panel {
  width: 720px;
  max-width: 100%;
  background: #0F172A;
  border: 1px solid #334155;
  color: #CBD5E1;
  border-radius: 14px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.6);
  overflow: hidden;
}
.panel-header { display:flex; align-items:center; justify-content:space-between; padding:18px; border-bottom:1px solid #1f2937 }
.panel-header h3 { margin:0; color:#F8FAFC; font-family: 'Bebas Neue', sans-serif }
.close-btn { background:transparent; border:none; color:#CBD5E1; font-size:20px; cursor:pointer }
.panel-body { padding:20px 22px }
.slogan { color:#EF4444; font-weight:700; margin-bottom:12px }
.section { margin-bottom:14px }
.section h4 { margin:0 0 6px 0; color:#F8FAFC }
.section p { margin:0; color:#CBD5E1 }

@media (max-width: 800px) {
  .company-panel { width: calc(100% - 32px) }
}
</style>
