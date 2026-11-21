export type EstadoTorneo =
  | 'proximo'
  | 'abierto'
  | 'en_curso'
  | 'finalizado'
  | 'cancelado'

export interface Torneo {
  id: number
  nombre: string
  videojuego: string
  modalidad: string
  fechaInicio: string
  cierreInscripcion: string
  cupoMaximo: number
  estado: EstadoTorneo
}
