<template>
  <div class="auth-card">
    <h2>🎮 Iniciar Sesión</h2>
    <p class="subtitle">Plataforma de Torneos GameHub IPVG</p>

    <form @submit.prevent="login">
      <div class="field">
        <label>Correo Institucional</label>
        <input
          v-model="form.correo"
          type="email"
          required
          placeholder="usuario@virginiogomez.cl"
        />
      </div>

      <div class="field">
        <label>Contraseña</label>
        <input
          v-model="form.password"
          type="password"
          required
          placeholder="••••••••"
        />
      </div>

      <p v-if="error" class="error-msg">{{ error }}</p>

      <button type="submit" :disabled="cargando">
        {{ cargando ? 'Verificando...' : 'Entrar a GameHub' }}
      </button>
    </form>

    <p class="footer-link">
      ¿No tienes cuenta? <router-link to="/registro">Regístrate aquí</router-link>
    </p>
  </div>
</template>

<script setup>
import { API_URL } from '../services/api'
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = ref({ correo: '', password: '' });
const error = ref('');
const cargando = ref(false);

async function login() {
  cargando.value = true;
  error.value = '';
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(Array.isArray(data.message) ? data.message[0] : (data.message || 'Error de autenticación'));
    }

    localStorage.setItem('token', data.access_token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));

    window.location.href = '/equipos';
  } catch (e) {
    error.value = e.message;
  } finally {
    cargando.value = false;
  }
}
</script>

<style scoped>
.auth-card {
  max-width: 400px;
  margin: 3.5rem auto;
  padding: 2.5rem;
  background: #202024;
  border-radius: 8px;
  border: 1px solid #323238;
}
h2 { margin: 0 0 0.25rem 0; color: #fff; }
.subtitle { color: #8d8d99; font-size: 0.9rem; margin-bottom: 1.5rem; }
.field { margin-bottom: 1.1rem; }
label { display: block; font-size: 0.85rem; color: #c4c4cc; margin-bottom: 0.35rem; }
input {
  width: 100%;
  padding: 10px;
  background: #121214;
  border: 1px solid #323238;
  border-radius: 4px;
  color: white;
}
input:focus { outline: 1px solid #00b37e; }
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
button:hover:not(:disabled) { background: #00875f; }
button:disabled { opacity: 0.6; cursor: not-allowed; }
.error-msg { color: #f75a68; font-size: 0.85rem; margin-top: 0.5rem; }
.footer-link { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: #a8a8b3; }
.footer-link a { color: #00b37e; text-decoration: none; font-weight: 600; }
</style>