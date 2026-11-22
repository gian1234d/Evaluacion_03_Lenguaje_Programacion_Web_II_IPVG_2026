<template>
  <div class="auth-card">
    <h2>🎮 Registro de Jugador</h2>
    <p class="subtitle">Crea tu perfil para armar equipos y competir</p>

    <form @submit.prevent="registrar">
      <div class="field">
        <label>Nombre Completo</label>
        <input v-model="form.nombre" required placeholder="Ej: Benjamín Mardones" />
      </div>

      <div class="field">
        <label>Alias / Gamertag</label>
        <input v-model="form.alias" required placeholder="Ej: BenjaPro77" />
      </div>

      <div class="field">
        <label>Correo Electrónico</label>
        <input v-model="form.correo" type="email" required placeholder="correo@virginiogomez.cl" />
      </div>

      <div class="field">
        <label>Contraseña (mínimo 6 caracteres)</label>
        <input v-model="form.password" type="password" minlength="6" required />
      </div>

      <p v-if="error" class="error-msg">{{ error }}</p>
      <p v-if="ok" class="ok-msg">¡Cuenta creada con éxito! Redirigiendo...</p>

      <button type="submit" :disabled="cargando">
        {{ cargando ? 'Registrando...' : 'Completar Registro' }}
      </button>
    </form>

    <p class="footer-link">
      ¿Ya estás registrado? <router-link to="/login">Inicia sesión</router-link>
    </p>
  </div>
</template>

<script setup>
import { API_URL } from '../services/api'
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = ref({ nombre: '', alias: '', correo: '', password: '' });
const error = ref('');
const ok = ref(false);
const cargando = ref(false);

async function registrar() {
  cargando.value = true;
  error.value = '';
  try {
    const res = await fetch(`${API_URL}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(Array.isArray(data.message) ? data.message[0] : (data.message || 'Error en el registro'));
    }
    ok.value = true;
    setTimeout(() => router.push('/login'), 1200);
  } catch (e) {
    error.value = e.message;
  } finally {
    cargando.value = false;
  }
}
</script>

<style scoped>
.auth-card {
  max-width: 420px;
  margin: 3rem auto;
  padding: 2.2rem;
  background: #202024;
  border-radius: 8px;
  border: 1px solid #323238;
}
h2 { margin: 0 0 0.25rem 0; color: #fff; }
.subtitle { color: #8d8d99; font-size: 0.9rem; margin-bottom: 1.5rem; }
.field { margin-bottom: 1rem; }
label { display: block; font-size: 0.85rem; color: #c4c4cc; margin-bottom: 0.35rem; }
input {
  width: 100%;
  padding: 9px;
  background: #121214;
  border: 1px solid #323238;
  border-radius: 4px;
  color: white;
}
button {
  width: 100%;
  padding: 12px;
  background: #00b37e;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 0.5rem;
}
.error-msg { color: #f75a68; font-size: 0.85rem; }
.ok-msg { color: #00b37e; font-size: 0.9rem; font-weight: bold; }
.footer-link { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: #a8a8b3; }
.footer-link a { color: #00b37e; text-decoration: none; font-weight: 600; }
</style>