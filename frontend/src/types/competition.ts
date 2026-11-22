export interface Partido {
  id: number
  torneoId: number
  equipoLocalId: number
  equipoVisitanteId: number
  fechaProgramada: string
  estado: string
}

export interface Resultado {
  id: number
  partidoId: number
  puntajeLocal: number
  puntajeVisitante: number
  ganadorId: number | null
  registradoPorId: string
  registradoEn: string
}

export interface PosicionRanking {
  torneoId: number
  equipoId: number
  partidosJugados: number
  victorias: number
  empates: number
  derrotas: number
  puntos: number
  puntosAFavor: number
  puntosEnContra: number
}
