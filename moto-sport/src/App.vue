<template>
  <div id="app">
    <SidebarToggler />
    <ContactPanel />
    <CompanyInfoPanel />
    <!-- Aquí se renderiza la vista activa -->
    <router-view />
  </div>
</template>
<script>
import SidebarToggler from '@/components/SidebarToggler.vue'
import ContactPanel from '@/components/ContactPanel.vue'
import CompanyInfoPanel from '@/components/CompanyInfoPanel.vue'

export default {
  name: 'App',
  components: { SidebarToggler, ContactPanel, CompanyInfoPanel }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@400;500;600;700&display=swap');

:root {
  color-scheme: dark;
  --bg-primary: #0F172A;
  --bg-panel: #1E293B;
  --bg-panel-soft: #111827;
  --bg-hover: #334155;
  --accent: #DC2626;
  --accent-strong: #EF4444;
  --success: #10B981;
  --success-dark: #059669;
  --primary: #2563EB;
  --primary-dark: #1D4ED8;
  --text-main: #CBD5E1;
  --text-strong: #F8FAFC;
  --text-muted: #94A3B8;
}
html, body, #app {
  min-height: 100%;
  background: var(--bg-primary);
  color: var(--text-main);
}
body {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  background-image: radial-gradient(circle at top left, rgba(148, 163, 184, 0.08), transparent 18%),
    radial-gradient(circle at bottom right, rgba(220, 38, 38, 0.08), transparent 18%);
}
.navbar {
  background: rgba(17, 24, 39, 0.92) !important;
  backdrop-filter: blur(14px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  position: sticky;
  top: 0;
  z-index: 1020;
}
.navbar-brand {
  color: var(--text-strong) !important;
  font-weight: 700;
  letter-spacing: 0.08em;
}
.navbar-dark .navbar-nav .nav-link,
.navbar-dark .navbar-nav .nav-link:focus,
.navbar-dark .navbar-nav .nav-link:active {
  color: var(--text-main) !important;
}
.navbar-dark .navbar-nav .nav-link:hover {
  color: var(--text-strong) !important;
}
.navbar-toggler {
  border-color: rgba(255, 255, 255, 0.16);
}
.btn {
  border-radius: 999px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}
.btn:hover {
  transform: scale(1.02);
}
.btn-primary {
  background: var(--primary) !important;
  border-color: var(--primary) !important;
  color: #fff !important;
}
.btn-primary:hover {
  background: var(--primary-dark) !important;
  border-color: var(--primary-dark) !important;
}
.btn-success {
  background: var(--success) !important;
  border-color: var(--success) !important;
  color: #fff !important;
}
.btn-success:hover {
  background: var(--success-dark) !important;
  border-color: var(--success-dark) !important;
}
.btn-danger {
  background: var(--accent) !important;
  border-color: var(--accent) !important;
  color: #fff !important;
}
.btn-danger:hover {
  background: #B91C1C !important;
  border-color: #B91C1C !important;
}
.btn-secondary {
  background: var(--bg-hover) !important;
  border-color: var(--bg-hover) !important;
  color: #fff !important;
}
.btn-secondary:hover {
  background: #475569 !important;
  border-color: #475569 !important;
}
.card,
.modal-card {
  background: var(--bg-panel) !important;
  border: 1px solid #334155 !important;
  color: var(--text-main) !important;
  border-radius: 18px !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25) !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card:hover,
.modal-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.32);
}
.card-title,
h3,
h5,
h2,
.modal-title,
.navbar-brand,
.login-card-header h2 {
  color: var(--text-strong) !important;
  font-family: 'Bebas Neue', sans-serif;
}
.card-text,
.table,
.table td,
.table th,
.form-label,
.form-control,
.form-select,
.text-muted,
small,
.alert,
.modal-body,
.login-card p,
.login-card .form-label {
  color: var(--text-main) !important;
}
.text-secondary {
  color: var(--text-muted) !important;
}
.form-control,
.form-select {
  background: var(--bg-panel) !important;
  border: 1px solid #475569 !important;
  color: #fff !important;
}
.form-control::placeholder {
  color: var(--text-muted) !important;
  opacity: 1;
}
.form-control:focus,
.form-select:focus {
  border-color: var(--primary) !important;
  box-shadow: 0 0 0 0.25rem rgba(37, 99, 235, 0.18) !important;
  background: var(--bg-panel) !important;
  color: #fff !important;
}
.table {
  color: var(--text-main) !important;
}
.table thead,
.table-light,
.table thead th {
  background: var(--bg-panel-soft) !important;
  color: var(--text-strong) !important;
  border-color: #334155 !important;
}
.table tbody tr {
  background: var(--bg-panel) !important;
  border-color: #334155 !important;
}
.table-hover tbody tr:hover {
  background: var(--bg-hover) !important;
}
.alert {
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.16);
}
.alert-info {
  background: rgba(30, 41, 59, 0.9) !important;
  border-color: #334155 !important;
}
.alert-danger {
  background: rgba(220, 38, 38, 0.14) !important;
  border-color: #B91C1C !important;
  color: #F8FAFC !important;
}
.alert-success {
  background: rgba(16, 185, 129, 0.14) !important;
  border-color: #10B981 !important;
  color: #F8FAFC !important;
}
.modal-backdrop {
  background: rgba(15, 23, 42, 0.92) !important;
  backdrop-filter: blur(8px);
  display: flex !important;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.modal-card {
  max-width: 640px;
  width: 100%;
}
.login-page {
  background: radial-gradient(circle at top, rgba(255, 255, 255, 0.08), transparent 20%),
    linear-gradient(180deg, #111827 0%, #0F172A 100%);
}
.login-card {
  width: min(100%, 420px);
  border: 1px solid #334155;
  background: var(--bg-panel) !important;
}
.login-card-header {
  background: linear-gradient(135deg, #111827 0%, #1E293B 100%);
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
.login-card .form-control {
  background: var(--bg-panel) !important;
  border-color: #475569 !important;
  color: #fff !important;
}
.login-card .form-control::placeholder {
  color: var(--text-muted) !important;
}
.login-card .btn-primary {
  background: var(--primary) !important;
  border-color: var(--primary) !important;
}
.login-card .btn-primary:hover {
  background: var(--primary-dark) !important;
}
.login-card .alert-danger {
  background: rgba(220, 38, 38, 0.14) !important;
  border-color: #B91C1C !important;
  color: #F8FAFC !important;
}
</style>
