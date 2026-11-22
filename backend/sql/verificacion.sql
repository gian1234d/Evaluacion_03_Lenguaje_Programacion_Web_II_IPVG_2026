-- Ejecutar en la base configurada para GameHub después de npm run demo.
SELECT t.id, t.nombre, t.cupoMaximo, COUNT(i.id) AS inscritos
FROM torneos t
LEFT JOIN inscripciones i ON i.torneoId = t.id
GROUP BY t.id, t.nombre, t.cupoMaximo
ORDER BY t.id;

SELECT t.nombre AS torneo, p.ronda, local.nombre AS equipo_local,
       visitante.nombre AS equipo_visitante, p.estado,
       r.puntajeLocal, r.puntajeVisitante, ganador.nombre AS equipo_ganador,
       u.alias AS registrado_por
FROM partidos p
JOIN torneos t ON t.id = p.torneoId
JOIN equipos local ON local.id = p.equipoLocalId
JOIN equipos visitante ON visitante.id = p.equipoVisitanteId
LEFT JOIN resultados r ON r.partidoId = p.id
LEFT JOIN equipos ganador ON ganador.id = r.ganadorId
LEFT JOIN usuarios u ON u.id = r.registradoPorId
ORDER BY p.id;

SELECT e.nombre AS equipo, c.alias AS capitan, u.alias AS integrante
FROM equipos e
JOIN usuarios c ON c.id = e.capitanId
JOIN equipo_integrantes i ON i.equipoId = e.id
JOIN usuarios u ON u.id = i.usuarioId
ORDER BY e.id, u.id;
