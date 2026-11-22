import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import mysql from 'mysql2/promise';

const base = process.env.API_URL ?? 'http://localhost:3000';
const suffix = randomBytes(4).toString('hex');
const password = process.env.DEMO_PASSWORD;
assert(
  password && password.length >= 8,
  'Configura DEMO_PASSWORD con al menos 8 caracteres',
);

async function request(method, path, status, body, token) {
  const response = await fetch(new URL(path, base), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  assert.equal(response.status, status, `${method} ${path}: ${text}`);
  console.log(`${response.status} ${method} ${path}`);
  return response.headers.get('content-type')?.includes('json') && text
    ? JSON.parse(text)
    : text;
}

const admin = {
  nombre: 'Administrador Demo',
  alias: `admin-${suffix}`,
  correo: `admin-${suffix}@example.com`,
  password,
};
const { id } = await request('POST', '/auth/registro', 201, admin);
const db = await mysql.createConnection({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USERNAME ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_DATABASE ?? 'gamehub_lpw2',
});
try {
  await db.execute("UPDATE usuarios SET rol = 'admin' WHERE id = ?", [id]);
} finally {
  await db.end();
}

const login = (correo, clave) => ({ correo, password: clave });
await request('POST', '/auth/login', 401, login(admin.correo, 'incorrecta'));
const { access_token: adminToken } = await request(
  'POST',
  '/auth/login',
  201,
  login(admin.correo, password),
);

const equipos = [];
let estudianteToken;
for (const nombre of ['Halcones', 'Cóndores', 'Pumas']) {
  const alias = `jugador-${equipos.length}-${suffix}`;
  const correo = `${alias}@example.com`;
  await request('POST', '/auth/registro', 201, {
    nombre,
    alias,
    correo,
    password,
  });
  const { access_token } = await request(
    'POST',
    '/auth/login',
    201,
    login(correo, password),
  );
  const equipo = await request(
    'POST',
    '/equipos',
    201,
    { nombre: `${nombre} ${suffix}`, juegoPreferido: 'Valorant' },
    access_token,
  );
  equipos.push(equipo);
  estudianteToken ??= access_token;
}

const torneo = {
  nombre: `Copa ${suffix}`,
  videojuego: 'Valorant',
  modalidad: 'Liga',
  fechaInicio: new Date(Date.now() + 172800000).toISOString(),
  cierreInscripcion: new Date(Date.now() + 86400000).toISOString(),
  estado: 'abierto',
  cupoMaximo: 2,
};

await request('POST', '/torneos', 401, torneo);
await request('POST', '/torneos', 403, torneo, estudianteToken);
await request(
  'POST',
  '/torneos',
  400,
  { ...torneo, cupoMaximo: 0 },
  adminToken,
);
const perfil = await request(
  'GET',
  '/usuarios/perfil',
  200,
  undefined,
  estudianteToken,
);
await request(
  'PATCH',
  '/usuarios/perfil',
  200,
  {
    nombre: 'Capitán Demo',
    alias: perfil.alias,
    correo: perfil.correo,
  },
  estudianteToken,
);
await request(
  'PATCH',
  `/equipos/${equipos[1].id}`,
  403,
  {
    nombre: 'Nombre rechazado',
  },
  estudianteToken,
);
const editado = await request(
  'PATCH',
  `/equipos/${equipos[0].id}`,
  200,
  {
    integrantesIds: [equipos[1].capitanId],
  },
  estudianteToken,
);
assert.equal(editado.integrantes.length, 2);
const primero = await request('POST', '/torneos', 201, torneo, adminToken);
const segundo = await request(
  'POST',
  '/torneos',
  201,
  { ...torneo, nombre: `Liga ${suffix}` },
  adminToken,
);
const filtrados = await request(
  'GET',
  `/torneos?q=${suffix}&juego=Valorant&estado=abierto&modalidad=Liga`,
  200,
);
assert.equal(filtrados.length, 2);
const inscribir = (torneoId, equipoId, status, token = adminToken) =>
  request('POST', '/inscripciones', status, { torneoId, equipoId }, token);
for (const torneoId of [primero.id, segundo.id]) {
  const inscripcion = await inscribir(
    torneoId,
    equipos[0].id,
    201,
    estudianteToken,
  );
  await inscribir(torneoId, equipos[0].id, 409, estudianteToken);
  await inscribir(torneoId, equipos[1].id, 201);
  await inscribir(torneoId, equipos[2].id, 409);
  const partidoData = {
    torneoId,
    equipoLocalId: equipos[0].id,
    equipoVisitanteId: equipos[1].id,
    fechaProgramada: torneo.fechaInicio,
  };
  await request('POST', '/partidos', 403, partidoData, estudianteToken);
  await request(
    'POST',
    '/partidos',
    400,
    { ...partidoData, equipoVisitanteId: equipos[2].id },
    adminToken,
  );
  const partido = await request(
    'POST',
    '/partidos',
    201,
    partidoData,
    adminToken,
  );
  await request(
    'DELETE',
    `/inscripciones/${inscripcion.id}`,
    409,
    undefined,
    adminToken,
  );
  const resultado = {
    partidoId: partido.id,
    puntajeLocal: 3,
    puntajeVisitante: 1,
  };
  await request('POST', '/resultados', 403, resultado, estudianteToken);
  await request('POST', '/resultados', 201, resultado, adminToken);
  await request('POST', '/resultados', 409, resultado, adminToken);
  const { estado } = await request('GET', `/partidos/${partido.id}`, 200);
  assert.equal(estado, 'finalizado');
  const ranking = await request('GET', `/ranking?torneoId=${torneoId}`, 200);
  assert.equal(ranking[0].equipoId, equipos[0].id);
  assert.equal(ranking[0].puntos, 3);
}
const cerrado = await request(
  'POST',
  '/torneos',
  201,
  {
    ...torneo,
    nombre: `Temporal ${suffix}`,
    cierreInscripcion: new Date(Date.now() - 86400000).toISOString(),
  },
  adminToken,
);
await inscribir(cerrado.id, equipos[0].id, 400, estudianteToken);
await request(
  'PATCH',
  `/torneos/${cerrado.id}`,
  200,
  { estado: 'cancelado' },
  adminToken,
);
await request('DELETE', `/torneos/${cerrado.id}`, 204, undefined, adminToken);
await request('GET', `/torneos/${cerrado.id}`, 404);
await request('GET', '/torneos/2147483647', 404);
await request('GET', '/api-json', 200);
console.log(
  `Datos demo creados. Administrador: ${admin.correo}. Torneos: ${primero.id}, ${segundo.id}.`,
);
