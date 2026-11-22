# Verificación de GameHub

La compilación de Vue y NestJS, las seis pruebas unitarias y la prueba e2e del controlador inicial pasaron. Se probó también la API integrada contra una instancia local de MySQL con las seis entidades.

| Caso verificado | Resultado |
| --- | --- |
| Registro, credenciales válidas e inválidas y edición del perfil | Registro y edición correctos. Credenciales inválidas devuelven 401. |
| Permisos de administración y de capitán | Una operación protegida sin sesión devuelve 401. Un estudiante que intenta gestionar un torneo, programar un partido, registrar un resultado o editar el equipo de otro capitán recibe 403. |
| Datos inválidos y búsqueda | Se rechaza el cupo cero. La búsqueda por texto combina juego, estado y modalidad. |
| Torneos y equipos | Se crearon, editaron y consultaron registros. Se eliminó un torneo de prueba y su ID devolvió 404 en una consulta posterior. |
| Inscripciones | Se acepta una inscripción válida. Se rechazan duplicados, cupo lleno, plazo vencido y cancelación de una inscripción que ya tiene un partido asociado. |
| Partidos y resultados | Se rechaza un partido con un equipo sin inscripción. Se admite un único resultado oficial y el partido pasa a finalizado. |
| Ranking y persistencia | El equipo ganador recibe tres puntos. Los datos siguen disponibles después de reiniciar la API. |
| Swagger y MySQL | El documento OpenAPI respondió en `/api-json`. Las consultas de `backend/sql/verificacion.sql` devolvieron los torneos, sus equipos y resultados. |

Con la API y una base de prueba activas, ejecutar `npm run demo` desde `backend`, con `DEMO_PASSWORD` de al menos ocho caracteres. El script usa la configuración MySQL del backend. Se puede indicar `API_URL` si la API usa un puerto distinto de 3000. Cada ejecución crea cuentas y datos de demostración nuevos.
